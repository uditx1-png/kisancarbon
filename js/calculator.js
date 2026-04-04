// EMISSION FACTORS

const EF={
    urea:2.25,
    dap:0.65,
    diesel:2.68,
    gridIndia:0.82,
    hpToKW:0.7457,
}


// FERTILIZERS FUNCTION
function calcFertilizerCO2(ureaKg,dapKg){
    const ureaCO2= ureaKg * EF.urea;
    const dapCO2= dapKg * EF.dap;
    return ureaCO2+ dapCO2;
}

// DIESEL FUNCTION

function calcDieselCO2(TractorLiters,genLiters){
    const totalLiters = TractorLiters + genLiters;
    return totalLiters * EF.diesel;
}


// PUMP FUNCTION

function calcPumpCO2(hours,hp){
    const kilowatts = hp * EF.hpToKW;
    const kwhUsed = kilowatts * hours;
    const co2 =kwhUsed * EF.gridIndia;
    return co2;
}

// MASTER FUNCTION 

function calcTotal(inputs) {
  const fertilizer = calcFertilizerCO2(
    inputs.ureaKg  || 0,
    inputs.dapKg   || 0
  );
  const diesel = calcDieselCO2(
    inputs.tractorL || 0,
    inputs.genL     || 0
  );
  const pump = calcPumpCO2(
    inputs.pumpHrs || 0,
    inputs.pumpHP  || 0
  );
  const total = fertilizer + diesel + pump;

  return {
    fertilizer: parseFloat(fertilizer.toFixed(2)),
    diesel:     parseFloat(diesel.toFixed(2)),
    pump:       parseFloat(pump.toFixed(2)),
    total:      parseFloat(total.toFixed(2))
  };
}

// GREEN SOURCE FUNCTION 

function calcGreenScore(totalCO2, acres) {
  if (acres <= 0 || totalCO2 < 0) return 100;
  const baseline = acres * 15;
  const raw      = 100 - ((totalCO2 / baseline) * 100);
  const score    = Math.min(100, Math.max(0, Math.round(raw)));

  let grade, color;
  if (score >= 75) { grade = "Excellent"; color = "#4A7C3F"; }
  else if (score >= 50) { grade = "Good";      color = "#D4A843"; }
  else if (score >= 25) { grade = "Average";   color = "#E07B39"; }
  else                  { grade = "Needs work"; color = "#C0392B"; }

  return { score, grade, color };
}