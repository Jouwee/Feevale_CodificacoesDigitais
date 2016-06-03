package codificacoes;

public class ConversorManchesterDiferencial implements Conversor {

    @Override
    public int[] convert(int lastBit, int currentBit, int lastSinal) {
        if (currentBit == 0) {
            if (lastSinal == 0) {
                return new int[] {-1, 1};
            } else if (lastBit == 1 || lastBit == 0) {
                return new int[] {-lastSinal, lastSinal};
            } else {
                return new int[] {lastSinal, -lastSinal};
            }
        } else {
            if (lastSinal == 0) {
                return new int[] {-1, 1};
            } else {
                return new int[] {lastSinal, -lastSinal};
            }
        }
    }

    @Override
    public String toString() {
        return "Manchester-Diferencial";
    }
    
}
    
