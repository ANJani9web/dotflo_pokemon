export let colors = {
  Normal: "bg-[#dcdcdc]",
  Fire: "bg-[#f08030]",
  Water: "bg-[#6890f0]",
  Electric: "bg-[#f8d030]",
  Grass: "bg-[#78c850]",
  Ice: "bg-[#98d8d8]",
  Fighting: "bg-[#c03028]",
  Poison: "bg-[#a040a0]",
  Ground: "bg-[#e0c068]",
  Flying: "bg-[#a890f0]",
  Psychic: "bg-[#f85888]",
  Bug: "bg-[#a8b820]",
  Rock: "bg-[#b8a038]",
  Ghost: "bg-[#705898]",
  Dragon: "bg-[#7038f8]",
  Dark: "bg-[#705848]",
  Steel: "bg-[#b8b8d0]",
  Fairy: "bg-[#ee99ac]",
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function TypeCard({ typeName }) {
  typeName = capitalizeFirstLetter(typeName);
  const bgColor = colors[typeName];
  // console.log(bgColor)
  return (
    <span className={`text-white text-xl py-2 ${bgColor} rounded-2xl flex items-center justify-center`}>
      {typeName}
    </span>
  );
}
