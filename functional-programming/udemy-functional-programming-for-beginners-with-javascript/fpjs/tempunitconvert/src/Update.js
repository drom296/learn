import * as R from "ramda";

const MSGS = {
  LEFT_VALUE_INPUT: "LEFT_VALUE_INPUT",
  RIGHT_VALUE_INPUT: "RIGHT_VALUE_INPUT",
  LEFT_UNIT_CHANGED: "LEFT_UNIT_SELECT",
  RIGHT_UNIT_CHANGED: "RIGHT_UNIT_SELECT"
};

export function leftValueInputMsg(leftValue) {
  return {
    type: MSGS.LEFT_VALUE_INPUT,
    leftValue
  };
}

export function rightValueInputMsg(rightValue) {
  return {
    type: MSGS.RIGHT_VALUE_INPUT,
    rightValue
  };
}

export function leftUnitChangedMsg(leftUnit) {
  return {
    type: MSGS.LEFT_UNIT_CHANGED,
    leftUnit
  };
}

export function rightUnitChangedMsg(rightUnit) {
  return {
    type: MSGS.RIGHT_UNIT_CHANGED,
    rightUnit
  };
}

const toInt = R.pipe(parseInt, R.defaultTo(0));
const FtoC = f => 5 / 9 * (f - 32);
const CtoF = c => 9 / 5 * (c + 32);
const KtoC = k => k - 273.15;
const CtoK = c => c + 273.15;
const KtoF = k => R.pipe(KtoC, CtoF)(k);
const FtoK = f => R.pipe(FtoC, CtoK)(f);
const identity = x => x;

const CONVERSIONS = {
  Fahrenheit: {
    Celsius: FtoC,
    Kelvin: FtoK,
    Fahrenheit: identity
  },
  Celsius: {
    Fahrenheit: CtoF,
    Kelvin: CtoK,
    Celsius: identity
  },
  Kelvin: {
    Fahrenheit: KtoF,
    Celsius: KtoC,
    Kelvin: identity
  }
};

function update(msg, model) {
  switch (msg.type) {
    case MSGS.LEFT_VALUE_INPUT:
      return updateLeftValue(msg, model);
    case MSGS.RIGHT_VALUE_INPUT:
      return updateRightValue(msg, model);
    case MSGS.LEFT_UNIT_CHANGED:
      return updateLeftUnit(msg, model);
    case MSGS.RIGHT_UNIT_CHANGED:
      return updateRightUnit(msg, model);
  }
  return model;
}

function updateLeftValue(msg, model) {
  if (msg.leftValue === "")
    return { ...model, sourceLeft: true, leftValue: "", rightValue: "" };
  const leftValue = toInt(msg.leftValue);
  return updateModel({ ...model, sourceLeft: true, leftValue });
}

function updateRightValue(msg, model) {
  if (msg.rightValue === "")
    return { ...model, sourceLeft: true, leftValue: "", rightValue: "" };
  const rightValue = toInt(msg.rightValue);
  return updateModel({ ...model, sourceLeft: false, rightValue });
}

function updateLeftUnit(msg, model) {
  const { leftUnit } = msg;
  return updateModel({ ...model, leftUnit });
}

function updateRightUnit(msg, model) {
  const { rightUnit } = msg;
  return updateModel({ ...model, rightUnit });
}

function updateModel(model) {
  if (model.sourceLeft) {
    const baseUnit = model.leftUnit;
    const baseValue = model.leftValue;
    const toUnit = model.rightUnit;

    const rightValue = CONVERSIONS[baseUnit][toUnit](baseValue);

    return { ...model, rightValue };
  } else {
    const baseUnit = model.rightUnit;
    const baseValue = model.rightValue;
    const toUnit = model.leftUnit;

    const leftValue = CONVERSIONS[baseUnit][toUnit](baseValue);

    return { ...model, leftValue };
  }

  return model;
}

export default update;
