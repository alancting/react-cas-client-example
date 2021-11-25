from cas import CASClientV3

class ProxyCASClientV3(CASClientV3):
    url_suffix = 'p3/proxyValidate'
    