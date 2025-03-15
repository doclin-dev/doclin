package com.doclin.view

import java.awt.BorderLayout
import javax.swing.*

class DoclinStartView : JPanel() {

    init {
        val contentPanel = JPanel()
        contentPanel.layout = BoxLayout(contentPanel, BoxLayout.Y_AXIS)

        val scrollPane = JScrollPane(contentPanel)
        scrollPane.verticalScrollBarPolicy = ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED
        scrollPane.horizontalScrollBarPolicy = ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER

        layout = BorderLayout()
        add(scrollPane, BorderLayout.CENTER)
    }
}