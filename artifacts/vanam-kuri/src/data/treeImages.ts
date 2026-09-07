/**
 * REALISTIC TREE IMAGES — Species-Specific Photos
 * 
 * All images sourced from Wikimedia Commons (CC BY-SA licensed).
 * Each species has two photo variants:
 *   - `sapling`: Young/newly planted tree (used for initialPhotoUrl, planting baseline)
 *   - `mature`:  Grown/established tree (used for currentPhotoUrl, checkpoint evidence)
 * 
 * These replace generic Unsplash forest photos with actual species-correct imagery.
 */

export const TREE_IMAGES = {
  // Neem (Azadirachta indica) — வேம்பு
  neem: {
    sapling: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Neem_tree_sapling.jpg/640px-Neem_tree_sapling.jpg',
    mature: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Neem_%28Azadirachta_indica%29_in_Hyderabad_W_IMG_6976.jpg/640px-Neem_%28Azadirachta_indica%29_in_Hyderabad_W_IMG_6976.jpg',
  },

  // Palmyra Palm (Borassus flabellifer) — பனை மரம்
  palmyra: {
    sapling: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Palmyra_Palm_Tree_Sprout.jpg/640px-Palmyra_Palm_Tree_Sprout.jpg',
    mature: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Borassus_flabellifer-2-tirunelveli-India.jpg/640px-Borassus_flabellifer-2-tirunelveli-India.jpg',
  },

  // Indian Beech / Pungai (Millettia pinnata / Pongamia pinnata) — புங்க மரம்
  pongamia: {
    sapling: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Pongamia_pinnata_%28Karanj%29_leaves_%26_flowers_W_IMG_5765.jpg/640px-Pongamia_pinnata_%28Karanj%29_leaves_%26_flowers_W_IMG_5765.jpg',
    mature: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Pongamia_pinnata_%28Indian_Beech%29_at_Marlinespikes_Auroville.jpg/640px-Pongamia_pinnata_%28Indian_Beech%29_at_Marlinespikes_Auroville.jpg',
  },

  // Arjun Tree / Marutham (Terminalia arjuna) — மருத மரம்
  arjuna: {
    sapling: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Terminalia_arjuna_young_plant.jpg/640px-Terminalia_arjuna_young_plant.jpg',
    mature: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Terminalia_arjuna_-_Arjun_Tree_at_NARC.jpg/640px-Terminalia_arjuna_-_Arjun_Tree_at_NARC.jpg',
  },

  // Jamun / Black Plum / Naval (Syzygium cumini) — நாவல் மரம்
  jamun: {
    sapling: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Syzygium_cumini_leaves.jpg/640px-Syzygium_cumini_leaves.jpg',
    mature: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Syzygium_cumini_%28Malabar_Plum%29_tree_in_Kawal_WS%2C_AP_W_IMG_1626.jpg/640px-Syzygium_cumini_%28Malabar_Plum%29_tree_in_Kawal_WS%2C_AP_W_IMG_1626.jpg',
  },

  // Indian Almond / Badam — Sacred Fig / Peepal (Ficus religiosa) — அரசமரம்
  peepal: {
    sapling: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Ficus_religiosa_-_young_tree.jpg/640px-Ficus_religiosa_-_young_tree.jpg',
    mature: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Ficus_religiosa_in_Kadavoor.jpg/640px-Ficus_religiosa_in_Kadavoor.jpg',
  },

  // Banyan Tree (Ficus benghalensis) — ஆலமரம்
  banyan: {
    sapling: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ficus_benghalensis_%28Indian_banyan%29_sapling.jpg/640px-Ficus_benghalensis_%28Indian_banyan%29_sapling.jpg',
    mature: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Ficus_benghalensis_%28Indian_Banyan%29_in_Secunderabad_W_IMG_6672.jpg/640px-Ficus_benghalensis_%28Indian_Banyan%29_in_Secunderabad_W_IMG_6672.jpg',
  },

  // Tamarind (Tamarindus indica) — புளியமரம்
  tamarind: {
    sapling: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Tamarindus_indica_pods.jpg/640px-Tamarindus_indica_pods.jpg',
    mature: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Tamarind_%28Tamarindus_indica%29_tree_in_Hyderabad%2C_AP_W_IMG_6614.jpg/640px-Tamarind_%28Tamarindus_indica%29_tree_in_Hyderabad%2C_AP_W_IMG_6614.jpg',
  },

  // Mahua / Indian Butter Tree (Madhuca longifolia) — இலுப்பை மரம்
  mahua: {
    sapling: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Madhuca_longifolia_flowers.jpg/640px-Madhuca_longifolia_flowers.jpg',
    mature: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Madhuca_longifolia_%28Mahua%29_tree_in_Ananthagiri_Hills%2C_AP_W_IMG_8648.jpg/640px-Madhuca_longifolia_%28Mahua%29_tree_in_Ananthagiri_Hills%2C_AP_W_IMG_8648.jpg',
  },
} as const;

/**
 * Maps a species name to the correct image pair.
 * Falls back to Neem if the species isn't found.
 */
export function getTreeImages(speciesName: string): { sapling: string; mature: string } {
  const lc = speciesName.toLowerCase();

  if (lc.includes('neem')) return TREE_IMAGES.neem;
  if (lc.includes('palmyra') || lc.includes('palm')) return TREE_IMAGES.palmyra;
  if (lc.includes('beech') || lc.includes('pungai') || lc.includes('pongamia')) return TREE_IMAGES.pongamia;
  if (lc.includes('arjun') || lc.includes('marutham')) return TREE_IMAGES.arjuna;
  if (lc.includes('jamun') || lc.includes('naval') || lc.includes('plum')) return TREE_IMAGES.jamun;
  if (lc.includes('peepal') || lc.includes('fig') || lc.includes('almond') || lc.includes('badam')) return TREE_IMAGES.peepal;
  if (lc.includes('banyan')) return TREE_IMAGES.banyan;
  if (lc.includes('tamarind')) return TREE_IMAGES.tamarind;
  if (lc.includes('mahua') || lc.includes('butter') || lc.includes('iluppai')) return TREE_IMAGES.mahua;

  // Default fallback: Neem
  return TREE_IMAGES.neem;
}
