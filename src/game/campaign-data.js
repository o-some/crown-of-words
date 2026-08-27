export const REGION_IDS = Object.freeze(['garden','library','wildlife','home','family','body','travel','movement','harbor','crown-castle']);
export const DISTRICT_TYPES = Object.freeze(['dock','learning','village','arena','fortress']);

const BLUEPRINTS = [
 ['garden','Garten','kai'],['library','Bibliothek','brax'],['wildlife','Tierwelt','blackfinn'],
 ['home','Zuhause','roderick'],['family','Familie','vargas'],['body','Körper','ironhook'],
 ['travel','Unterwegs','thorne'],['movement','Bewegung','corvin'],['harbor','Hafen-Turnier','azrak'],
 ['crown-castle','Kronenschloss','varkos']
];
const ROUTES = [
 ['garden','library'],['garden','wildlife'],['library','home'],['library','family'],
 ['wildlife','family'],['wildlife','body'],['home','body'],['family','body'],['family','travel'],
 ['body','travel'],['body','movement'],['travel','movement'],['travel','harbor'],
 ['movement','harbor'],['harbor','crown-castle']
];
const districtId = (regionId,type) => `${regionId}:${type}`;

export function createCampaignDefinition(){
 const regions=Object.fromEntries(BLUEPRINTS.map(([id,name,bossId],i)=>[id,{id,name,bossId,order:i+1,districts:DISTRICT_TYPES.map(type=>districtId(id,type))}]));
 const districts={};
 for(const region of Object.values(regions)){
  DISTRICT_TYPES.forEach((type,i)=>{districts[districtId(region.id,type)]={id:districtId(region.id,type),regionId:region.id,type,localOrder:i,neighbors:[]};});
  for(let i=0;i<DISTRICT_TYPES.length-1;i+=1){const a=districtId(region.id,DISTRICT_TYPES[i]);const b=districtId(region.id,DISTRICT_TYPES[i+1]);districts[a].neighbors.push(b);districts[b].neighbors.push(a);}
 }
 const regionRoutes=ROUTES.map(([a,b])=>({id:[a,b].sort().join('~'),regions:[a,b]}));
 return {regions,districts,regionRoutes};
}

export function validateCampaignDefinition(definition){
 const errors=[];
 if(Object.keys(definition.regions).length!==10) errors.push('campaign must contain exactly 10 regions');
 if(Object.keys(definition.districts).length!==50) errors.push('campaign must contain exactly 50 districts');
 for(const district of Object.values(definition.districts)) for(const neighborId of district.neighbors){const neighbor=definition.districts[neighborId];if(!neighbor) errors.push(`missing neighbor ${neighborId}`);else if(!neighbor.neighbors.includes(district.id)) errors.push(`asymmetric adjacency ${district.id}`);}
 for(const route of definition.regionRoutes) if(route.regions.some(id=>!definition.regions[id])) errors.push(`invalid region route ${route.id}`);
 return errors;
}
