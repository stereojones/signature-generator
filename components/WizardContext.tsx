"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import {
  getInitialLocationValue,
  type BrandConfig,
  type BrandId,
  type SignatureConfig,
} from "@/templates/brands";

export type WizardStep = 1 | 2 | 3 | 4;

export type WizardState = {
  step: WizardStep;
  brandId: BrandId | null;
  wantsHeadshot: boolean | null;
  formData: Record<string, string>;
  headshotUrl: string | null;
};

type WizardAction =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SELECT_BRAND"; brandId: BrandId; defaultLocation: string }
  | { type: "SET_WANTS_HEADSHOT"; wantsHeadshot: boolean }
  | { type: "UPDATE_FIELD"; key: string; value: string }
  | { type: "SET_FORM_DATA"; formData: Record<string, string> }
  | { type: "SET_HEADSHOT_URL"; url: string | null }
  | { type: "RESET" };

const initialState: WizardState = {
  step: 1,
  brandId: null,
  wantsHeadshot: null,
  formData: {},
  headshotUrl: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SELECT_BRAND":
      return {
        ...state,
        brandId: action.brandId,
        wantsHeadshot: null,
        formData: { location: action.defaultLocation },
        headshotUrl: null,
      };
    case "SET_WANTS_HEADSHOT":
      return {
        ...state,
        wantsHeadshot: action.wantsHeadshot,
        headshotUrl: action.wantsHeadshot ? state.headshotUrl : null,
      };
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.key]: action.value },
      };
    case "SET_FORM_DATA":
      return { ...state, formData: action.formData };
    case "SET_HEADSHOT_URL":
      return { ...state, headshotUrl: action.url };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

type WizardContextValue = {
  state: WizardState;
  brands: BrandConfig[];
  signatures: SignatureConfig[];
  selectedBrand: BrandConfig | null;
  selectedSignature: SignatureConfig | null;
  setStep: (step: WizardStep) => void;
  selectBrand: (brandId: BrandId) => void;
  setWantsHeadshot: (wantsHeadshot: boolean) => void;
  updateField: (key: string, value: string) => void;
  setHeadshotUrl: (url: string | null) => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipHeadshotStep: () => void;
};

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({
  children,
  brands,
  signatures,
}: {
  children: ReactNode;
  brands: BrandConfig[];
  signatures: SignatureConfig[];
}) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const selectedBrand = useMemo(
    () => brands.find((brand) => brand.id === state.brandId) ?? null,
    [brands, state.brandId],
  );

  const selectedSignature = useMemo(() => {
    if (!state.brandId || state.wantsHeadshot === null) return null;
    return (
      signatures.find(
        (signature) =>
          signature.brand.id === state.brandId &&
          signature.wantsHeadshot === state.wantsHeadshot,
      ) ?? null
    );
  }, [signatures, state.brandId, state.wantsHeadshot]);

  const setStep = useCallback((step: WizardStep) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const selectBrand = useCallback(
    (brandId: BrandId) => {
      const brand = brands.find((item) => item.id === brandId);
      dispatch({
        type: "SELECT_BRAND",
        brandId,
        defaultLocation: brand ? getInitialLocationValue(brand) : "",
      });
    },
    [brands],
  );

  const setWantsHeadshot = useCallback((wantsHeadshot: boolean) => {
    dispatch({ type: "SET_WANTS_HEADSHOT", wantsHeadshot });
  }, []);

  const updateField = useCallback((key: string, value: string) => {
    dispatch({ type: "UPDATE_FIELD", key, value });
  }, []);

  const setHeadshotUrl = useCallback((url: string | null) => {
    dispatch({ type: "SET_HEADSHOT_URL", url });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({
      type: "SET_STEP",
      step: Math.min(4, state.step + 1) as WizardStep,
    });
  }, [state.step]);

  const prevStep = useCallback(() => {
    const skipHeadshot = state.wantsHeadshot === false;

    if (skipHeadshot && state.step === 4) {
      dispatch({ type: "SET_STEP", step: 2 });
      return;
    }

    dispatch({
      type: "SET_STEP",
      step: Math.max(1, state.step - 1) as WizardStep,
    });
  }, [state.step, state.wantsHeadshot]);

  const skipHeadshotStep = useCallback(() => {
    dispatch({ type: "SET_STEP", step: 4 });
  }, []);

  const value = useMemo(
    () => ({
      state,
      brands,
      signatures,
      selectedBrand,
      selectedSignature,
      setStep,
      selectBrand,
      setWantsHeadshot,
      updateField,
      setHeadshotUrl,
      reset,
      nextStep,
      prevStep,
      skipHeadshotStep,
    }),
    [
      state,
      brands,
      signatures,
      selectedBrand,
      selectedSignature,
      setStep,
      selectBrand,
      setWantsHeadshot,
      updateField,
      setHeadshotUrl,
      reset,
      nextStep,
      prevStep,
      skipHeadshotStep,
    ],
  );

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within WizardProvider");
  }
  return context;
}
