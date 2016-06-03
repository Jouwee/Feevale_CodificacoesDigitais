package codificacoes;

public class ConversorNRZ implements Conversor {

    @Override
    public int[] convert(int lastBit, int currentBit, int lastSinal) {
        if (currentBit == 0) {
            return new int[] {0, 0};
        } else {
            return new int[] {1, 1};
        }
    }

    @Override
    public String toString() {
        return "NRZ";
    }
    
}
