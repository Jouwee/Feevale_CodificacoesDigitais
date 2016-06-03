/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package codificacoes;

import java.awt.BasicStroke;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.HeadlessException;
import java.awt.RenderingHints;
import java.awt.event.ActionEvent;
import javax.swing.AbstractAction;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class Codificacoes extends JFrame {

    private static final String STRING_INICIAL = "0101010101";
    private int[] bits;
    private Conversor conversor;
    private JTextField fBits;
    private JComboBox<Conversor> fConversores;
    private Graph graph;
    
    public static void main(String[] args) {
        Codificacoes c = new Codificacoes();
        c.setVisible(true);
    }

    public Codificacoes() throws HeadlessException {
        super();
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(650, 400);
        graph = new Graph();
        getContentPane().setLayout(new BorderLayout());
        getContentPane().add(buildParams(), BorderLayout.NORTH);
        getContentPane().add(graph);
        update();
    }
    
    private JComponent buildParams() {
        JPanel panel = new JPanel(new FlowLayout());
        panel.setBorder(BorderFactory.createEmptyBorder());
        panel.add(new JLabel("String de bits:"));
        panel.add(buildFieldBits());
        panel.add(new JLabel("Codificação:"));
        panel.add(buildFieldConversores());
        panel.add(new JButton(new AbstractAction("Gerar") {
            @Override
            public void actionPerformed(ActionEvent e) {
                update();
            }
        }));
        return panel;
    }
    
    private JComponent buildFieldBits() {
        fBits = new JTextField(STRING_INICIAL, 20);
        return fBits;
    }
    
    private JComponent buildFieldConversores() {
        fConversores = new JComboBox<>(new Conversor[] {
            new ConversorNRZ(),
            new ConversorNRZL(),
            new ConversorNRZI(),
            new ConversorBipolarAMI(),
            new ConversorPseudoternario(),
            new ConversorManchester(),
            new ConversorManchesterDiferencial()
        });
        return fConversores;
    }
    
    private void update() {
        String t = fBits.getText();
        bits = new int[t.length()];
        for (int i = 0; i < bits.length; i++) {
            bits[i] = Integer.parseInt(String.valueOf(t.charAt(i)));
        }
        conversor = (Conversor) fConversores.getSelectedItem();
        graph.repaint();
    }
    
    private class Graph extends JPanel {

        @Override
        public void paint(Graphics g) {
            super.paint(g);
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, getWidth(), getHeight());
            Graphics2D g2d = (Graphics2D) g.create();
            g2d.translate(50, 50);
            int w = 50;
            int h = 50;
            int th = 200;
            int ty = 30;
            int start = 100;
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            int lastBit = 0;
            int lastSinal = 0;
            for (int i = 0; i < bits.length; i++) {
                int x = i * w;
                if (i % 2 == 0) {
                    g2d.setColor(new Color(0xDDDDDD));
                    g2d.fillRect(x, 0, w, th);
                }
                g2d.setColor(Color.BLACK);
                g2d.setStroke(new BasicStroke(1, 0, 0, 1, new float[] {2, 3}, 0));
                g2d.drawLine(x, 0, x, th);
            }
            g2d.setStroke(new BasicStroke(1));
            g2d.setColor(Color.BLACK);
            g2d.setFont(new Font("Tahoma", Font.PLAIN, 12));
            g2d.drawLine(0, start, w * bits.length, start);
            g2d.drawString("0V", -30, start + 5);
            g2d.drawLine(0, start + h, w * bits.length, start + h);
            g2d.drawString("-5V", -30, start + 5 + h);
            g2d.drawLine(0, start - h, w * bits.length, start - h);
            g2d.drawString("+5V", -30, start + 5 - h);
            for (int i = 0; i < bits.length; i++) {
                int x = i * 50;
                int[] sinais = conversor.convert(lastBit, bits[i], lastSinal);
                g2d.setStroke(new BasicStroke(3));
                g2d.setColor(Color.BLACK);
                g2d.setFont(new Font("Courier New", Font.BOLD, 22));
                g2d.drawString(String.valueOf(bits[i]), x + 20, ty);
                int y0 = (lastSinal * -1) * h + start;
                int y1 = (sinais[0] * -1) * h + start;
                int y2 = (sinais[1] * -1) * h + start;
                g2d.drawLine(x, y0, x, y1);
                g2d.drawLine(x, y1, x + w / 2, y1);
                g2d.drawLine(x + w / 2, y1, x + w / 2, y2);
                g2d.drawLine(x + w / 2, y2, x + w, y2);
                lastBit = bits[i];
                lastSinal = sinais[1];
            }
            g2d.setColor(Color.BLACK);
            g2d.setStroke(new BasicStroke(1));
            g2d.setFont(new Font("Tahoma", Font.BOLD, 28));
            g2d.drawString(conversor.toString(), 0, -10);
            g2d.dispose();
        }
    
    }
    
}
