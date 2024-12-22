# Nginx API Gateway Configuration Guide

## Overview
This document contains all necessary steps, do's and don'ts, and learnings from setting up an API Gateway using Nginx. It includes details about configuration file management, service routing, caching, rate limiting, adding custom headers, and troubleshooting.

---

## Table of Contents
1. [Project Structure and Files](#project-structure-and-files)
2. [Steps to Configure Nginx](#steps-to-configure-nginx)
3. [Key Learnings](#key-learnings)
4. [Testing the Setup](#testing-the-setup)
5. [Do's and Don'ts](#dos-and-donts)

---

## Project Structure and Files

### File Locations
1. **Nginx Installation Directory:** `C:\nginx-1.27.3`
   - Default location where Nginx is installed.
2. **Custom Configuration File:**
   - Example: `D:\my-project\nginx\custom.conf`
3. **Logs Directory:**
   - Access and error logs are located at `C:\nginx-1.27.3\logs`.

### Configuration File Example (`custom.conf`)
```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    upstream property_service {
        server localhost:3002;
    }

    upstream water_service {
        server localhost:3001;
    }

    server {
        listen       3000;
        server_name  localhost;

        location /property_service {
            rewrite ^/property_service(/.*)? $1 break;
            proxy_pass http://property_service;
        }

        location /water_service {
            rewrite ^/water_service(/.*)? $1 break;
            proxy_pass http://water_service;
        }
    }
}
```

---

## Steps to Configure Nginx

1. **Install Nginx:**
   - Download and install Nginx from the [official website](https://nginx.org/en/download.html).
   - Extract and place it in a directory (e.g., `C:\nginx-1.27.3`).

2. **Install npm in Respective Folders:**
    - Navigate to the service directories (e.g., water-service and property-service) and initialize npm:
    ```bash
        cd path/to/service-folder
        npm install
    ```


3. **Create or Modify Configuration File:**
   - Write a custom configuration file, e.g., `custom.conf`, and ensure it includes routing rules for your services.
        - Rate Limiting: Limits the number of requests per second (5 requests per second per client).
        - Custom Headers: Added a custom header X-Custom-Header to responses.
        - Caching: Enabled caching for responses from backend services for 1 minute.

4. **Specify the Custom Configuration File:**
   - Start Nginx using the custom configuration file:
     ```bash
     .\nginx.exe -c "D:/my-project/nginx/custom.conf"
     ```
   - Ensure you use double quotes for paths containing spaces.

5. **Restart Nginx:**
   - After modifying the config file, restart Nginx to apply changes:
     ```bash
     .\nginx.exe -s reload
     ```
    

6. **Run Services:**
   - Ensure your backend services are running independently on their respective ports (e.g., `3001` for water service and `3002` for property service).

7. **Stop Nginx:**
   - To stop Nginx, use the following command:
     ```bash
     .\nginx.exe -s stop
     ```
---

## Key Learnings

### 1. **Config File Location**
   - By default, Nginx uses `C:\nginx-1.27.3\conf\nginx.conf`. However, you can specify a custom configuration file with the `-c` flag.

### 2. **Naming Conventions**
   - Always name your custom configuration files descriptively (e.g., `custom.conf` (used in this project)).

### 3. **Caching Setup**
   - The `proxy_cache_path` directive specifies the location for the cache and its configuration. If you're using a custom directory for cache, ensure it exists and is accessible by Nginx.
   - Nginx caching stores responses from the backend services and serves them for subsequent requests.
   - **To cache you only need a empty directory, do not create any file inside the directory.**
   - **Testing Cache**: After making requests to a service endpoint (e.g., `/property_service`), subsequent requests should be served from the cache (unless expired).

### 4. **Rate Limiting**
   - The `limit_req_zone` and `limit_req` directives are used to limit the rate of requests. In this setup, requests are limited to 5 requests per second per client.

### 5. **Adding Custom Headers**
   - The `proxy_set_header` directive is used to add custom headers, such as `X-Custom-Header`, to responses from your services.

### 6. **Successful Configuration Message**
   - After running the custom configuration, a successful message like this should appear:
     ```
     nginx: configuration file D:/my-project/nginx/custom.conf test is successful
     ```

### 7. **Error Log Analysis**
   - Common errors like "the rewritten URI has a zero length" can be resolved by ensuring your `rewrite` directive does not result in an empty path.

---

## Testing the Setup

### 1. **Endpoints to Test**
   - Property Service:
     ```bash
     http://localhost:3000/property_service
     ```
     Expected Response: `Hello World2! from property-service.`

   - Water Service:
     ```bash
     http://localhost:3000/water_service
     ```
     Expected Response: `Hello World1! from water-service.`

### 2. **Simulating Errors**
   - Try a non-existent route, e.g., `http://localhost:3000/unknown`, to ensure Nginx returns a `404` or appropriate error response.

### 3. **Inspect Logs**
   - Use the error and access logs to debug issues:
     - `C:\nginx-1.27.3\logs\error.log`
     - `C:\nginx-1.27.3\logs\access.log`

---

## Do's and Don'ts

### Do's
1. Always test your configuration file before starting Nginx:
   ```bash
   .\nginx.exe -t -c "path/to/config/file.conf"
   ```

2. Use meaningful names for upstream services and locations.
3. Ensure backend services are running on the ports specified in the config file.
4. Keep your config file organized and include comments for better readability.

### Don'ts
1. Don’t forget to reload Nginx after modifying the configuration:
   ```bash
   .\nginx.exe -s reload
   ```

2. Don’t use relative paths for the configuration file; always provide absolute paths.
3. Avoid hardcoding IP addresses or ports unless absolutely necessary.

---

## Final Notes
This guide should help you successfully configure and troubleshoot your Nginx setup for API Gateway functionality. For further customization or issues, refer to the [Nginx documentation](https://nginx.org/en/docs/).

