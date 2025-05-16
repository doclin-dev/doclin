package com.doclin.view

import java.awt.BorderLayout
import java.awt.Color
import java.awt.Component
import javax.swing.*
import javax.swing.border.CompoundBorder
import javax.swing.border.EmptyBorder
import javax.swing.border.LineBorder

class ThreadListView : JPanel() {
    private val threadList = JList<String>()

    init {
        layout = BorderLayout()
        border = EmptyBorder(5, 5, 5, 5)
        threadList.cellRenderer = ThreadListCellRenderer()
        add(JScrollPane(threadList), BorderLayout.CENTER)
    }

    fun updateThreads(threads: List<String>) {
        threadList.setListData(threads.toTypedArray())
    }

    private class ThreadListCellRenderer : ListCellRenderer<String> {
        private val panel = JPanel(BorderLayout())
        private val label = JLabel()
        private val border = CompoundBorder(LineBorder(Color.LIGHT_GRAY), EmptyBorder(5, 5, 5, 5))

        init {
            panel.add(label, BorderLayout.CENTER)
            panel.border = border
        }

        override fun getListCellRendererComponent(
            list: JList<out String>?,
            value: String?,
            index: Int,
            isSelected: Boolean,
            cellHasFocus: Boolean
        ): Component {
            label.text = value
            if (isSelected) {
                panel.background = list?.selectionBackground
                panel.foreground = list?.selectionForeground
            } else {
                panel.background = list?.background
                panel.foreground = list?.foreground
            }
            return panel
        }
    }
}