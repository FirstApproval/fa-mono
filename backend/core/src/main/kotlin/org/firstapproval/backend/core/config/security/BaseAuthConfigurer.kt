package org.firstapproval.backend.core.config.security

import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.security.web.util.matcher.OrRequestMatcher
import org.springframework.security.web.util.matcher.RequestMatcher

abstract class BaseAuthConfigurer<T : AbstractHttpConfigurer<T, HttpSecurity>> :
    AbstractHttpConfigurer<T, HttpSecurity>() {
    protected lateinit var requestMatcher: RequestMatcher
    protected var enableCsrf: Boolean = false

    fun requestMatcher(vararg antPaths: AntPathRequestMatcher): T {
        if (antPaths.isEmpty()) {
            this.requestMatcher = RequestMatcher { false }
        } else {
            this.requestMatcher = OrRequestMatcher(antPaths.toList())
        }
        return this as T
    }

    fun requestMatcher(vararg antPaths: String): T {
        if (antPaths.isEmpty()) {
            this.requestMatcher = RequestMatcher { false }
        } else {
            this.requestMatcher = OrRequestMatcher(antPaths.map { AntPathRequestMatcher(it) })
        }
        return this as T
    }

    fun requestMatcher(requestMatcher: RequestMatcher): T {
        this.requestMatcher = requestMatcher
        return this as T
    }

    fun enableCsrf(enableCsrf: Boolean): T {
        this.enableCsrf = enableCsrf
        return this as T
    }
}
