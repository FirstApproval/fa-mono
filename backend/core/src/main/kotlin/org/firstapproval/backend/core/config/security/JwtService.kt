package org.firstapproval.backend.core.config.security

import com.auth0.jwk.UrlJwkProvider
import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm.HS512
import org.firstapproval.backend.core.config.Properties.OauthProperties
import org.firstapproval.backend.core.config.Properties.JwtProperties
import org.springframework.stereotype.Service
import java.net.URL
import java.security.PublicKey
import java.time.Duration
import java.time.Instant.now
import java.util.Date
import java.util.Date.from

@Service
class JwtService(
    private val jwtProperties: JwtProperties,
    oauthProperties: OauthProperties
) {
    private val googlePublicKey0 = UrlJwkProvider(URL(oauthProperties.google.certsUrl)).all[0].publicKey
    private val googlePublicKey1 = UrlJwkProvider(URL(oauthProperties.google.certsUrl)).all[1].publicKey

    fun generate(claims: Map<String, Any>): String {
        return Jwts.builder()
            .setClaims(claims.toMutableMap())
            .setExpiration(newExpirationDate(jwtProperties.ttl))
            .signWith(HS512, jwtProperties.signature.toByteArray())
            .compact()
    }

    fun parse(token: String): Claims {
        try {
            return Jwts.parser()
                .setSigningKey(jwtProperties.signature.toByteArray())
                .parseClaimsJws(token)
                .body
        } catch (ex: JwtException) {
            throw InvalidTokenException()
        }
    }

    fun parseGoogle(token: String): Claims = try {
        parseOauthToken(token, googlePublicKey0)
    } catch (e: Exception) {
        parseOauthToken(token, googlePublicKey1)
    }

    fun isTokenExpired(claims: Claims): Boolean {
        val expirationDate = claims.expiration
        return expirationDate.before(Date())
    }

    private fun parseOauthToken(token: String, publicKey: PublicKey): Claims {
        try {
            return Jwts.parser()
                .setSigningKey(publicKey)
                .parseClaimsJws(token)
                .body
        } catch (ex: JwtException) {
            throw InvalidTokenException()
        }
    }

    private fun newExpirationDate(ttl: Duration): Date {
        return from(now().plus(ttl))
    }
}
