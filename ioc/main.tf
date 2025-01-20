terraform {
  required_version = ">= 1.0.0"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "docker" {
  host = "unix:///Users/misha/.docker/run/docker.sock"
}

resource "docker_image" "nginx" {
  name         = "nginx:latest"
  keep_locally = false
}

resource "docker_container" "nginx" {
  image    = docker_image.nginx.image_id
  name     = "nginx-test"
  must_run = true
  ports {
    internal = 80
    external = 8080
  }
}
