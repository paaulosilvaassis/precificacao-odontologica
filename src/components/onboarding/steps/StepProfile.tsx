"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, Users, Calendar, Clock, Armchair } from "lucide-react";
import type { ClinicProfile } from "@/lib/types";

interface StepProfileProps {
  onNext: (data: ClinicProfile) => void;
  initialData: ClinicProfile | null;
}

export function StepProfile({ onNext, initialData }: StepProfileProps) {
  const [formData, setFormData] = useState<ClinicProfile>(
    initialData || {
      name: "",
      city: "",
      state: "",
      workAlone: true,
      daysPerWeek: 5,
      hoursPerDay: 8,
      chairs: 1,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Perfil da Clínica
          </h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome da clínica</Label>
          <Input
            id="name"
            placeholder="Ex: Clínica Sorriso Perfeito"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="border-purple-200 focus:border-purple-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              placeholder="Ex: São Paulo"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              placeholder="Ex: SP"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
              maxLength={2}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Label className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Você trabalha sozinho ou com equipe?
          </Label>
          <RadioGroup
            value={formData.workAlone ? "alone" : "team"}
            onValueChange={(value) =>
              setFormData({ ...formData, workAlone: value === "alone" })
            }
          >
            <div className="flex items-center space-x-2 p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
              <RadioGroupItem value="alone" id="alone" />
              <Label htmlFor="alone" className="cursor-pointer flex-1">
                Trabalho sozinho
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
              <RadioGroupItem value="team" id="team" />
              <Label htmlFor="team" className="cursor-pointer flex-1">
                Tenho equipe
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="daysPerWeek" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Dias por semana
            </Label>
            <Input
              id="daysPerWeek"
              type="number"
              min="1"
              max="7"
              value={formData.daysPerWeek}
              onChange={(e) =>
                setFormData({ ...formData, daysPerWeek: parseInt(e.target.value) })
              }
              required
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoursPerDay" className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Horas por dia
            </Label>
            <Input
              id="hoursPerDay"
              type="number"
              min="1"
              max="24"
              value={formData.hoursPerDay}
              onChange={(e) =>
                setFormData({ ...formData, hoursPerDay: parseInt(e.target.value) })
              }
              required
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chairs" className="flex items-center gap-2">
              <Armchair className="w-4 h-4 text-purple-600" />
              Cadeiras
            </Label>
            <Input
              id="chairs"
              type="number"
              min="1"
              value={formData.chairs}
              onChange={(e) =>
                setFormData({ ...formData, chairs: parseInt(e.target.value) })
              }
              required
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
        >
          Continuar
        </Button>
      </div>
    </form>
  );
}
