FROM --platform=$TARGETPLATFORM golang:1.20.14-bookworm

ENV \
  TZ=Asia/Shanghai \
  GOPROXY=https://goproxy.cn,direct

WORKDIR /app

RUN apt-get update && apt-get install -y tzdata tmux git vim curl wget unzip strace htop lsof net-tools netcat-openbsd iputils-ping tree procps && rm -rf /var/lib/apt/lists/*
RUN git config --global credential.helper store
RUN go install github.com/go-delve/delve/cmd/dlv@v1.23.1
RUN go install github.com/air-verse/air@v1.61.1
RUN go install github.com/google/gops@v0.3.28

ENV \
  GOFILE="main.go" \
  DLV_DEBUG_PORT=40000

CMD \
  dlv debug \
    --output .__debug_bin \
    --headless \
    --listen=:${DLV_DEBUG_PORT} \
    --api-version=2 \
    --accept-multiclient \
    --log ${GOFILE}
