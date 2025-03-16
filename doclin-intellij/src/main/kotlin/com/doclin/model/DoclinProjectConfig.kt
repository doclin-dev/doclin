package com.doclin.model

import kotlinx.serialization.Serializable

@Serializable
data class DoclinProjectConfig(
    val organizationId: String,
    val projectId: Int
)