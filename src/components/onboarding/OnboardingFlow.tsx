"use client";

import { useState, useEffect } from "react";
import { StepProfile } from "./steps/StepProfile";
import { StepFixedCosts } from "./steps/StepFixedCosts";
import { StepTeam } from "./steps/StepTeam";
import { StepGoals } from "./steps/StepGoals";
import { StepEquipment } from "./steps/StepEquipment";
import { ProgressBar } from "./ProgressBar";
import type { ClinicData, ClinicProfile, FixedCosts, Team, Goals, Equipment } from "@/lib/types";

interface OnboardingFlowProps {
  onComplete: (data: ClinicData) => void;
  initialData?: ClinicData | null;
  isEditing?: boolean;
}

export function OnboardingFlow({ onComplete, initialData, isEditing = false }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<ClinicProfile | null>(initialData?.profile || null);
  const [fixedCosts, setFixedCosts] = useState<FixedCosts | null>(initialData?.fixedCosts || null);
  const [team, setTeam] = useState<Team | null>(initialData?.team || null);
  const [goals, setGoals] = useState<Goals | null>(initialData?.goals || null);
  const [equipment, setEquipment] = useState<Equipment[]>(initialData?.equipment || []);

  const totalSteps = 5;

  useEffect(() => {
    // Se estiver editando, carregar dados iniciais
    if (initialData) {
      setProfile(initialData.profile);
      setFixedCosts(initialData.fixedCosts);
      setTeam(initialData.team);
      setGoals(initialData.goals);
      setEquipment(initialData.equipment);
    }
  }, [initialData]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = (equipmentData: Equipment[]) => {
    if (profile && fixedCosts && team && goals) {
      const clinicData: ClinicData = {
        profile,
        fixedCosts,
        team,
        goals,
        equipment: equipmentData,
      };
      onComplete(clinicData);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {isEditing ? "Editar cadastro da clínica" : "Vamos conhecer sua clínica"}
          </h2>
          <p className="text-gray-600">
            {isEditing 
              ? "Atualize as informações da sua clínica. Todos os custos e preços serão recalculados automaticamente."
              : "Responda algumas perguntas simples para calcularmos seus custos reais"
            }
          </p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="mt-8">
          {currentStep === 1 && (
            <StepProfile
              onNext={(data) => {
                setProfile(data);
                handleNext();
              }}
              initialData={profile}
            />
          )}

          {currentStep === 2 && (
            <StepFixedCosts
              onNext={(data) => {
                setFixedCosts(data);
                handleNext();
              }}
              onBack={handleBack}
              initialData={fixedCosts}
            />
          )}

          {currentStep === 3 && (
            <StepTeam
              onNext={(data) => {
                setTeam(data);
                handleNext();
              }}
              onBack={handleBack}
              initialData={team}
            />
          )}

          {currentStep === 4 && (
            <StepGoals
              onNext={(data) => {
                setGoals(data);
                handleNext();
              }}
              onBack={handleBack}
              initialData={goals}
            />
          )}

          {currentStep === 5 && (
            <StepEquipment
              onComplete={handleComplete}
              onBack={handleBack}
              initialData={equipment}
            />
          )}
        </div>
      </div>
    </div>
  );
}
