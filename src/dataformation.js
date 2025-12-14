export const MOCK_DATA = [
    ...Array.from({ length: 20 }).map((_, i) => ({
      id: `web-paris-${i}`, title: `Master Développement Web ${i + 1}`, school: "Tech Paris School", city: "Paris", country: "France", level: "Master", category: "Développement Web", duration: "2 ans", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300&h=200",
    })),
    ...Array.from({ length: 30 }).map((_, i) => ({
      id: `web-fianar-${i}`, title: `Licence Informatique ${i + 1}`, school: "ENI Fianarantsoa", city: "Fianarantsoa", country: "Madagascar", level: "Licence", category: "Développement Web", duration: "3 ans", image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&q=80&w=300&h=200",
    })),
    { id: 'marketing-1', title: "MBA Digital Marketing", school: "HEC Paris", city: "Paris", country: "France", level: "MBA", category: "Marketing", duration: "1 an", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=300&h=200" },
    { id: 'marketing-2', title: "Licence Marketing", school: "UCM", city: "Antananarivo", country: "Madagascar", level: "Licence", category: "Marketing", duration: "3 ans", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=300&h=200" },
    { id: 'art-1', title: "Beaux Arts Design", school: "Ecole des Arts", city: "Lyon", country: "France", level: "Bachelor", category: "Art & Design", duration: "3 ans", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=300&h=200" },
  ];