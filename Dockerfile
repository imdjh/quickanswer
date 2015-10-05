FROM base/archlinux
Maintainer Jiahao <dyejarhoo@gmail.com>

RUN pacman -Syu && \
        pacman -S libreoffice-fresh && \
        rm -rf /var/lib/pacman && \
        rm -rf /var/cache/pacman
RUN cd /var/tmp && \
        curl -O https://aur.archlinux.org/cgit/aur.git/snapshot/pandoc-bin.tar.gz && \
        tar -xf pandoc-bin.tar.gz && \
        cd pandoc-bin && \
        yes | makepkg -i && \
        rm -rf /var/tmp/*

COPY . /srv/quickanswer

