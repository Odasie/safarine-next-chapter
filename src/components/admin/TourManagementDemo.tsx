import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTourManagement, getTourStatusSummary, formatStatistics } from '@/hooks/use-tour-management';
import { CheckCircle, AlertCircle, XCircle, Loader2, BarChart3 } from 'lucide-react';

export const TourManagementDemo = () => {
  const {
    statistics,
    statisticsLoading,
    createTour,
    addImage,
    validateTour,
    isCreatingTour,
    isAddingImage,
  } = useTourManagement();

  const [newTour, setNewTour] = useState({
    title_en: '',
    title_fr: '',
    destination: 'Kanchanaburi',
    duration_days: 1,
    price: 0,
  });

  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [selectedTourId, setSelectedTourId] = useState('');

  const handleCreateTour = async () => {
    if (!newTour.title_en || !newTour.title_fr) return;
    
    try {
      createTour({
        title_en: newTour.title_en,
        title_fr: newTour.title_fr,
        destination: newTour.destination,
        duration_days: newTour.duration_days,
        price: newTour.price > 0 ? newTour.price : undefined,
      });
      
      // Reset form
      setNewTour({
        title_en: '',
        title_fr: '',
        destination: 'Kanchanaburi',
        duration_days: 1,
        price: 0,
      });
    } catch (error) {
      console.error('Failed to create tour:', error);
    }
  };

  const handleValidateTour = async () => {
    if (!selectedTourId) return;
    
    try {
      const results = await validateTour(selectedTourId);
      setValidationResults(results);
    } catch (error) {
      console.error('Failed to validate tour:', error);
    }
  };

  const statusSummary = getTourStatusSummary(statistics);
  const formattedStats = formatStatistics(statistics);

  const getStatusIcon = (status: string) => {
    if (status === '✅ PASS') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === '⚠️ PARTIAL') return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Système de Gestion des Tours</h2>
        <Badge variant="secondary">Nouveau</Badge>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statisticsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statusSummary.total}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tours Complets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statisticsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statusSummary.complete}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux Complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statisticsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${statusSummary.completionRate}%`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attention Requise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statisticsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statusSummary.needsAttention}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      {!statisticsLoading && statistics && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques Détaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {statistics.map((stat) => (
                <div key={stat.stat_name} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="text-sm font-medium">{stat.stat_name}</div>
                    <div className="text-2xl font-bold">{stat.count_value}</div>
                  </div>
                  <div className="text-2xl">{stat.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Tour */}
      <Card>
        <CardHeader>
          <CardTitle>Créer un Nouveau Tour</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title-en">Titre (Anglais)</Label>
              <Input
                id="title-en"
                value={newTour.title_en}
                onChange={(e) => setNewTour(prev => ({ ...prev, title_en: e.target.value }))}
                placeholder="Tour title in English"
              />
            </div>
            <div>
              <Label htmlFor="title-fr">Titre (Français)</Label>
              <Input
                id="title-fr"
                value={newTour.title_fr}
                onChange={(e) => setNewTour(prev => ({ ...prev, title_fr: e.target.value }))}
                placeholder="Titre du tour en français"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={newTour.destination}
                onChange={(e) => setNewTour(prev => ({ ...prev, destination: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="duration">Durée (jours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="30"
                value={newTour.duration_days}
                onChange={(e) => setNewTour(prev => ({ ...prev, duration_days: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label htmlFor="price">Prix (THB)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={newTour.price}
                onChange={(e) => setNewTour(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <Button 
            onClick={handleCreateTour}
            disabled={isCreatingTour || !newTour.title_en || !newTour.title_fr}
            className="w-full"
          >
            {isCreatingTour && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer le Tour
          </Button>
        </CardContent>
      </Card>

      {/* Validate Tour */}
      <Card>
        <CardHeader>
          <CardTitle>Valider un Tour</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="ID du tour à valider"
              value={selectedTourId}
              onChange={(e) => setSelectedTourId(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleValidateTour}
              disabled={!selectedTourId}
            >
              Valider
            </Button>
          </div>

          {validationResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Résultats de Validation:</h4>
              {validationResults.map((result, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-medium">{result.validation_check}</div>
                    <div className="text-sm text-muted-foreground">{result.message}</div>
                  </div>
                  <Badge variant={result.status === '✅ PASS' ? 'default' : result.status === '⚠️ PARTIAL' ? 'secondary' : 'destructive'}>
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features List */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités Implémentées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✅ Base de Données</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Contraintes et validation automatique</li>
                <li>• Génération automatique des slugs</li>
                <li>• Comptage automatique des images</li>
                <li>• Triggers pour la maintenance</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✅ Workflow</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Création de tours simplifiée</li>
                <li>• Ajout d'images automatisé</li>
                <li>• Validation de la complétude</li>
                <li>• Statistiques en temps réel</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};