FROM node:6
Maintainer Jiahao <dyejarhoo@gmail.com>

ENV LANG C.UTF-8
# Install pandoc
RUN apt-get update && \
        apt-get upgrade -y && \
        apt-get install -y cabal-install python-pip libdbus-glib-1-2-dbg libgl1-mesa-dev libcups2-dev && \
        apt-get clean && \
        rm -rf /var/lib/apt/lists/*

ENV PATH /root/.cabal/bin:$PATH
RUN cabal update && \
        cabal install pandoc pandoc-types

# Install libreoffice fresh
RUN cd /var/tmp && \
        curl -fsSL -O http://download.documentfoundation.org/libreoffice/stable/5.2.5/deb/x86_64/LibreOffice_5.2.5_Linux_x86-64_deb.tar.gz && \
        tar -xf *.gz && \
        cd *_deb/DEBS && \
        dpkg -i *.deb && \
        rm -rf /var/tmp/* && \
        curl -o /usr/bin/unoconv https://github.com/dagwieers/unoconv/raw/master/unoconv && \
        chmod +x /usr/bin/unoconv

# Install python package pandocfilters
RUN pip install pandocfilters

COPY . /srv/quickanswer
WORKDIR /srv/quickanswer
RUN npm install

EXPOSE 8080

ENTRYPOINT ["/bin/bash"]
CMD ["run.sh"]
