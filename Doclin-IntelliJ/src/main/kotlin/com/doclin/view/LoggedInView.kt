package com.doclin.view

import java.awt.Component
import java.awt.Dimension
import javax.swing.*

class LoggedInView : JPanel() {

    init {
        layout = BoxLayout(this, BoxLayout.Y_AXIS)

        val textField = JTextField()
        textField.maximumSize = Dimension(Short.MAX_VALUE.toInt(), textField.preferredSize.height)
        add(textField)

        val submitButton = JButton("Submit")
        submitButton.addActionListener {
            JOptionPane.showMessageDialog(this, "Text: ${textField.text}")
        }
        submitButton.alignmentX = Component.CENTER_ALIGNMENT
        add(submitButton)
    }
}