package codificacoes;

public class ConversorPseudoternario implements Conversor {

    private int index = 0;
    
    @Override
    public int[] convert(int lastBit, int currentBit, int lastSinal) {
        if (currentBit == 0) {
            return new int[] {0, 0};
        } else {
            index++;
            if (index % 2 == 0) {
                return new int[] {1, 1};
            } else {
                return new int[] {-1, -1};
            }
        }
    }

    @Override
    public String toString() {
        return "Pseudoternário";
    }
    
}
    
