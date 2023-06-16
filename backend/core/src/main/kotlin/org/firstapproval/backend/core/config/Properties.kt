package org.firstapproval.backend.core.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component
import java.net.URL
import java.time.Duration
import kotlin.properties.Delegates.notNull

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
    @ConfigurationProperties("frontend")
    class FrontendProperties {
        lateinit var url: URL
    }

    @Component
    @ConfigurationProperties("email")
    class EmailProperties {
        lateinit var host: String
        var port by notNull<Int>()
        lateinit var username: String
        lateinit var password: String
        lateinit var from: String
        lateinit var transportProtocol: String
        var smtpAuth by notNull<Boolean>()
        var smtpStarttlsEnable by notNull<Boolean>()
        var smtpSslEnable by notNull<Boolean>()
    }
}
