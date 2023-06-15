package org.firstapproval.backend.core.web.errors

import jakarta.persistence.EntityNotFoundException
import jakarta.validation.ConstraintViolationException
import mu.KotlinLogging.logger
import org.firstapproval.backend.core.exception.RecordConflictException
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatus.*
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.status
import org.springframework.orm.ObjectRetrievalFailureException
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import javax.naming.LimitExceededException

@ControllerAdvice
class ExceptionHandler : ResponseEntityExceptionHandler() {

    val log = logger {}

    @ExceptionHandler(
        MethodArgumentTypeMismatchException::class,
        ConstraintViolationException::class,
        IllegalArgumentException::class,
    )
    fun handleValidation(e: Exception): ResponseEntity<Any> {
        log.warn(e) { e.message }
        return response(BAD_REQUEST, description = e.message)
    }

    @ExceptionHandler
    fun handle(e: BadCredentialsException): ResponseEntity<Any> {
        log.warn(e) { e.message }
        return response(UNAUTHORIZED, description = e.message)
    }

    @ExceptionHandler
    fun handle(e: AccessDeniedException): ResponseEntity<Any> {
        log.warn(e) { e.message }
        return response(FORBIDDEN, description = e.message)
    }

    @ExceptionHandler
    fun handle(e: LimitExceededException): ResponseEntity<Any> {
        log.warn(e) { e.message }
        return response(TOO_MANY_REQUESTS, description = e.message)
    }


    @ExceptionHandler(
        ObjectRetrievalFailureException::class,
        EntityNotFoundException::class,
        EmptyResultDataAccessException::class,
        NoSuchElementException::class,
    )
    fun handleNotFound(e: Exception): ResponseEntity<Any> {
        log.warn(e.message, e)
        return response(NOT_FOUND, description = e.message)
    }

    @ExceptionHandler
    fun handleConflictException(e: RecordConflictException): ResponseEntity<Any> {
        log.warn(e.message, e)
        return response(CONFLICT, description = e.message)
    }

    @ExceptionHandler
    fun handleGeneralException(e: Exception): ResponseEntity<Any> {
        log.warn("Unhandled exception", e)
        return response(INTERNAL_SERVER_ERROR)
    }

    protected fun response(
        status: HttpStatus,
        error: Enum<*> = status,
        description: String? = null,
        data: Any? = null
    ): ResponseEntity<Any> {
        return status(status).body(ErrorBody(error, description, data))
    }

    override fun handleMethodArgumentNotValid(
        ex: MethodArgumentNotValidException,
        headers: HttpHeaders,
        status: HttpStatusCode,
        request: WebRequest
    ): ResponseEntity<Any>? {
        val errors = ex.bindingResult.fieldErrors.map { "${it.field} ${it.defaultMessage}" }
        return response(BAD_REQUEST, description = "validation error", data = mapOf("errors" to errors))
    }

    override fun handleExceptionInternal(
        e: Exception,
        body: Any?,
        headers: HttpHeaders,
        statusCode: HttpStatusCode,
        request: WebRequest
    ): ResponseEntity<Any>? {
        log.error(e) { "Response entity exception has occurred" }
        return super.handleExceptionInternal(e, body, headers, statusCode, request)
    }
}
