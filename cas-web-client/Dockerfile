FROM node:16.2.0

ENV WORKDIR /cas-web-client

ADD ./application ${WORKDIR}
RUN cd ${WORKDIR} && \
    yarn install

WORKDIR ${WORKDIR}

CMD ["yarn", "start"]