FROM node:6

EXPOSE 3000 4000

RUN mkdir /imaging-analysis-app
WORKDIR /imaging-analysis-app

ADD package.json /imaging-analysis-app
RUN npm install

ADD . /imaging-analysis-app

RUN apt-get update -y && apt-get upgrade -y
RUN curl -O https://repo.continuum.io/archive/Anaconda3-4.2.0-Linux-x86_64.sh
RUN bash Anaconda3-4.2.0-Linux-x86_64.sh -b
RUN export PATH="/root/anaconda3/bin:$PATH"
RUN /root/anaconda3/bin/conda config --add channels conda-forge && yes | /root/anaconda3/bin/conda install nipype

CMD ["npm", "start"]
