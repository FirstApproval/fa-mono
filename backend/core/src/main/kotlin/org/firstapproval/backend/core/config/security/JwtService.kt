package org.firstapproval.backend.core.config.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm.HS512
import org.firstapproval.backend.core.config.Properties.JwtProperties
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.Instant.now
import java.util.*
import java.util.Date.from

@Service
class JwtService(
    private val jwtProperties: JwtProperties,
) {
    fun generate(claims: Map<String, Any>, ttl: Duration = jwtProperties.ttl): String {
        return Jwts.builder()
            .setClaims(claims.toMutableMap())
            .setExpiration(newExpirationDate(ttl))
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

    private fun newExpirationDate(ttl: Duration): Date {
        return from(now().plus(ttl))
    }
}
