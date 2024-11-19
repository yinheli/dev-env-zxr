# 基于 orbstack 构建的本地开发环境

# 名词解释

## orbstack

[OrbStack](https://orbstack.dev/) 是为 macOS 设计的 Docker 和 Kubernetes 的一种集成解决方案。它旨在在 macOS 系统上更简便、更高效地管理容器化应用和微服务架构。

## helm

[helm](https://helm.sh/) 是 kubernetes 的包管理工具，用于部署和管理 kubernetes 应用。


## helmfile

[helmfile](https://helmfile.readthedocs.io/en/latest/) 是 helm 的扩展，用于管理 helm 应用的部署。是包管理工具的工具。

## k9s

[k9s](https://k9scli.io/) 是 kubernetes 的命令行 tui 工具，用于管理 kubernetes 集群。

# 实践

## 原理

使用 OrbStack 搭建 kubernetes，使用 helmfile 管理 helm 应用的部署。通过 host-path 挂载服务源码目录，在容器中启动微服务。

## 构建 gozero 运行基础 helm chart

- golang-dev
  集成 golang 构建/开发环境和基础工具，参考 [Dockerfile](./containers/golang-dev/Dockerfile)。 chart 参考 [golang-dev](./charts/golang-dev)。

- etcdkeeper
  etcd 使用 bitnami 的 helm chart 部署。 etcdkeeper 是 etcd 的客户端。

## 定义服务依赖

参考 [values/env-template.yaml](./values/env-template.yaml)。

通过自定义的 services 配置，定义服务之间的依赖，以及相关的运行参数，工作目录等。

由于微服务数量比较多，为了减少并发编译造成的资源竞争，故不使用 go run 的方式，而是先编译后运行，在实际编译前还会检查服务依赖。

服务依赖启动顺序是通过 initContainer 来实现的，通过 nz 命令检查服务的 tcp 是否可用。

## 开发 & 调试

- make sync 或者 make apply 同步 helmfile 定义的资源。
- 等待服务启动即可
- 如果要用 ide 调试某个服务，可以先用 k9s 暂停对应的微服务（通过设置副本数量为 0）
  然后 ide 中启动相应的服务

