package com.doclin.utils

import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManager
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.psi.PsiFile
import com.intellij.psi.PsiManager

object ProjectUtils {
    private const val DOCLIN_FILENAME = ".doclin"

    fun getCurrentProjectName(): String? {
        val project: Project? = ProjectManager.getInstance().openProjects.firstOrNull()
        return project?.name
    }

    fun getCurrentProject(): Project? {
        return ProjectManager.getInstance().openProjects.firstOrNull()
    }

    fun findDoclinFile(project: Project): VirtualFile? {
        return project.projectFile?.parent?.findChild(DOCLIN_FILENAME)
    }
}