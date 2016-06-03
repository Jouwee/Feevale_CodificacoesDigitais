package codificacoes;

public class ConversorNRZI implements Conversor {

    @Override
    public int[] convert(int lastBit, int currentBit, int lastSinal) {
        if (currentBit == 1) {
            if (lastSinal == -1 || lastSinal == 0) {
                return new int[] {1, 1};
            } else {
                return new int[] {-1, -1};
            }
        } else {
            return new int[] {lastSinal, lastSinal};
        }
    }

    @Override
    public String toString() {
        return "NRZI";
    }
    
}
    
