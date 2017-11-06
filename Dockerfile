FROM node:6

EXPOSE 3000 4000

RUN mkdir /imaging-analysis-app
WORKDIR /imaging-analysis-app

ADD package.json /imaging-analysis-app
RUN npm install

ADD . /imaging-analysis-app

RUN npm install
CMD ["npm", "start"]
