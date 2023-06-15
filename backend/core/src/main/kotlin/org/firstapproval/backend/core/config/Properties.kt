package org.firstapproval.backend.core.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import java.net.URL
import java.time.Duration

class Properties {
    @Component
    @ConfigurationProperties("s3")
    class S3Properties {
        lateinit var accessKey: String
        lateinit var secretKey: String
        lateinit var url: URL
        lateinit var bucketName: String
    }

    @Component
    @ConfigurationProperties("jwt")
    class JwtProperties {
        lateinit var signature: String
        lateinit var ttl: Duration
    }

    @Component
    @ConfigurationProperties("oauth")
    class OauthProperties {
        var google = OauthProviderProperties()
        var facebook = OauthProviderProperties()

        class OauthProviderProperties {
            lateinit var clientId: String
            lateinit var clientSecret: String
            lateinit var redirectUri: String
            lateinit var authUrl: String
            lateinit var tokenUrl: String
            lateinit var certsUrl: String
            lateinit var dataUrl: String
            lateinit var scopes: String
        }
    }
}
