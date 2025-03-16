package com.doclin.controller

import com.doclin.utils.ProjectUtils.findDoclinFile
import com.intellij.openapi.project.Project

class DoclinInit(project: Project) {
    val doclinInitialized: Boolean

    init {
        val doclinFile = findDoclinFile(project)

        doclinInitialized = doclinFile != null
    }
}