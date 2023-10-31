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
        lateinit var buckets: Set<String>
        var localMode by notNull<Boolean>()
        lateinit var downloadLinkTtl: Duration
        lateinit var bucketPostfix: String
        lateinit var bucketStorageClass: String
    }

    @Component
    @ConfigurationProperties("ipfs")
    class IpfsProperties {
        lateinit var contentsUrl: String
        lateinit var accessKey: String
    }

    @Component
    @ConfigurationProperties("jwt")
    class JwtProperties {
        lateinit var signature: String
        lateinit var ttl: Duration
        lateinit var publicationArchiveTokenTtl: Duration
    }

    @Component
    @ConfigurationProperties("oauth")
    class OauthProperties {
        var google = OauthProviderProperties()
        var facebook = OauthProviderProperties()
        var linkedin = OauthProviderProperties()
        var orcid = OauthProviderProperties()

        class OauthProviderProperties {
            lateinit var clientId: String
            lateinit var clientSecret: String
            lateinit var redirectUri: String
            lateinit var authUrl: String
            lateinit var tokenUrl: String
            lateinit var certsUrl: String
            lateinit var dataUrl: String
            lateinit var dataUrl2: String
            lateinit var scopes: String
        }
    }

    @Component
    @ConfigurationProperties("frontend")
    class FrontendProperties {
        lateinit var url: URL
        lateinit var registrationConfirmationUrl: URL
        lateinit var emailChangeConfirmationUrl: URL
        lateinit var passwordChangeConfirmationUrl: URL
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
        var noopMode by notNull<Boolean>()
    }

    @Component
    @ConfigurationProperties("elasticsearch")
    class ElasticSearchProperties {
        lateinit var host: String
        var port by notNull<Int>()
    }

    @Component
    @ConfigurationProperties("admin")
    class AdminProperties {
        lateinit var login: String
        lateinit var password: String
    }
}
