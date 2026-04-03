import { Parcela } from "@/types";

type ItemProps = {
  parcela: Parcela;
  isSelected: boolean;
  onSelect: (parcela: Parcela) => void;
};

function ParcelaListItem({ parcela, isSelected, onSelect }: ItemProps) {
  return (
    <button
      onClick={() => onSelect(parcela)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-green-600 text-white"
          : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
      }`}
    >
      Parcela {parcela.id} — {parcela.municipio}
    </button>
  );
}

type Props = {
  parcelas: Parcela[];
  selectedParcela: Parcela | null;
  onSelect: (parcela: Parcela) => void;
};

function ParcelaList({ parcelas, selectedParcela, onSelect }: Props) {
  if (parcelas.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {parcelas.map((parcela) => (
          <ParcelaListItem
            key={parcela.id}
            parcela={parcela}
            isSelected={selectedParcela?.id === parcela.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
export default ParcelaList;
