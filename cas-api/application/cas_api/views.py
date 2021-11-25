from django.conf import settings
from .proxy_cas_client import ProxyCASClientV3
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

@api_view(['POST'])
def post_grant_access(request):
    """Request to grant access by validating a PT with cas server
    POST /api/grant_access

    Parameters
    ----------
    pt : string, required
        Proxy Ticket for api service
    
    Returns
    -------
    status : Boolean
        Grant access status
    """
    if request.data.get("pt") is not None:
        pt = request.data.get("pt")
        kwargs = dict(
                service_url=settings.API_SERVER_URL,
                server_url=settings.CAS_SERVER_URL,
                verify_ssl_certificate=settings.CAS_VERIFY_SSL_CERTIFICATE
            )
        client = ProxyCASClientV3(**kwargs)
        username, attributes, pgtiou = client.verify_ticket(pt)
        if username is not None:
            user, user_created = User.objects.get_or_create(username=username)
            token, token_created  = Token.objects.get_or_create(user=user)
            if not token_created:
                token.delete()
                Token.objects.create(user=user, key=pt)
            return Response({'status': True})
        else:
            error = {'status': False,'message': 'Invalid pt'}
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
    else:
        error = {'status': False,'message': 'Missing required data'}
        return Response(error, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    """Get profile of current request user
    GET /api/me

    Returns
    -------
    status : Boolean
        Grant access status
    user: User
        User basic data
    auth: Auth
        Auth data
    """
    response = {
        "status": True,
        'user': {
            'id': request.user.id,
            'username': request.user.username
        },
        'auth': {
            'created': request.auth.created
        }
    }
    return Response(response)
