FROM python:3.6.12 as builder

ENV WORKDIR /application
ENV PORT 3000

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR ${WORKDIR}

ADD ./application ${WORKDIR}
RUN chown -R ${APP_USER}:${APP_USER} ${WORKDIR}

RUN rm -rf ~/.cache/pip && \
    pip install -r requirements.txt --no-cache-dir

RUN python manage.py makemigrations

EXPOSE ${PORT}
