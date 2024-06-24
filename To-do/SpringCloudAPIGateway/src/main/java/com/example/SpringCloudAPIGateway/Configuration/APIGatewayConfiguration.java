package com.example.SpringCloudAPIGateway.Configuration;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class APIGatewayConfiguration {
    @Bean
    public RouteLocator appRoutes(RouteLocatorBuilder builder){
        return builder.routes().route(p->p
                                       .path("/api/v1/**")
                                       .uri("lb://authentication-service/"))
                               .route(p->p
                                       .path("/api/v2/**")
                                       .uri("lb://task-service/"))
                                       .build();
    }
}
