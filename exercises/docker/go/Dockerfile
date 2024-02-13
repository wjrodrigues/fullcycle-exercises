FROM golang:1.22.0-alpine3.18 AS build

COPY main.go /main.go

WORKDIR /

RUN go build /main.go

FROM scratch

COPY --from=build /main /main

CMD [ "./main" ]