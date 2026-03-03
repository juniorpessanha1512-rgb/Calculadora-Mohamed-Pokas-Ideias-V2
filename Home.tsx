import { useBossCalculator, Employee } from '@/hooks/useBossCalculator';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, UserPlus, X, ChevronDown, ChevronUp, Cloud, Key } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Design: Calculadora Mohamed Pokas Ideias 2026
 * - Fundo épico com chamas douradas e elementos visuais marcantes
 * - Card centralizado com design premium
 * - Paleta: Dourado, Vermelho, Branco sobre fundo dark
 */
export default function Home() {
  const {
    state,
    syncKey,
    setSyncKey,
    addBoss,
    removeBoss,
    addValue,
    removeValue,
    clearDayData,
    markAsSent,
    resetSentAmounts,
  } = useBossCalculator();

  const [bossName, setBossName] = useState('');
  const [bossPercentage, setBossPercentage] = useState('');
  const [valuesInput, setValuesInput] = useState<{ [key: string]: string }>({});
  const [sentAmountInput, setSentAmountInput] = useState<{ [key: string]: string }>({});
  const [expandedBossId, setExpandedBossId] = useState<string | null>(null);
  const [tempSyncKey, setTempSyncKey] = useState('');
  const [showSyncInput, setShowSyncInput] = useState(false);

  // Estado para novos funcionários
  const [newEmployees, setNewEmployees] = useState<Employee[]>([]);
  const [empName, setEmpName] = useState('');
  const [empPercentage, setEmpPercentage] = useState('');

  const handleAddEmployee = () => {
    if (!empName.trim() || !empPercentage.trim()) return;
    const percentageNum = parseFloat(empPercentage);
    if (isNaN(percentageNum) || percentageNum <= 0) return;

    setNewEmployees([
      ...newEmployees,
      { id: Date.now().toString(), name: empName.trim(), percentage: percentageNum }
    ]);
    setEmpName('');
    setEmpPercentage('');
  };

  const removeNewEmployee = (id: string) => {
    setNewEmployees(newEmployees.filter(e => e.id !== id));
  };

  const handleAddBoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bossName.trim() || !bossPercentage.trim()) return;

    const isBossNameExists = state.bosses.some(boss => boss.name.toLowerCase() === bossName.trim().toLowerCase());

    if (isBossNameExists) {
      toast.error('Patrão com este nome já existe.');
      return;
    }
    
    const percentageNum = parseFloat(bossPercentage);
    if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) return;

    // Validar soma total das porcentagens
    const totalEmployeesPercentage = newEmployees.reduce((sum, emp) => sum + emp.percentage, 0);
    if (percentageNum + totalEmployeesPercentage > 100) {
      alert(`Erro: A soma das porcentagens (${percentageNum + totalEmployeesPercentage}%) ultrapassa 100%`);
      return;
    }

    addBoss(bossName.trim(), percentageNum, newEmployees);
    setBossName('');
    setBossPercentage('');
    setNewEmployees([]);
  };

  const handleAddValues = (bossId: string) => {
    const input = valuesInput[bossId] || '';
    if (!input.trim()) return;

    const values = input
      .split('+')
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v) && v > 0);

    values.forEach(value => {
      addValue(bossId, value);
    });

    setValuesInput({ ...valuesInput, [bossId]: '' });
  };

  const handleInputChange = (bossId: string, value: string) => {
    setValuesInput({ ...valuesInput, [bossId]: value });
  };

  const handleKeyPress = (e: React.KeyboardEvent, bossId: string) => {
    if (e.key === 'Enter') {
      handleAddValues(bossId);
    }
  };

  const toggleExpand = (bossId: string) => {
    setExpandedBossId(expandedBossId === bossId ? null : bossId);
  };

  const handleSyncKeySubmit = () => {
    if (tempSyncKey.trim()) {
      setSyncKey(tempSyncKey.trim());
      setShowSyncInput(false);
      setTempSyncKey('');
    }
  };

  const handleLogout = () => {
    setSyncKey('');
    toast.info('Sessão encerrada. Dados locais mantidos.');
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-start py-4 md:py-8 overflow-x-hidden overflow-y-auto">
      {/* Fundo Épico */}
      <div 
        className="fixed inset-0 opacity-100"
        style={{
          backgroundImage: 'url(/images/bg-epic.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      
      {/* Overlay com gradiente */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 pointer-events-none" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl px-2 md:px-4">
        
        {/* Barra de Sincronização */}
        <div className="sticky top-0 z-50 mb-4 flex justify-end py-2">
          {syncKey ? (
            <div className="bg-green-600/90 backdrop-blur text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-green-400/50">
              <Cloud className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-bold">Sincronizado: {syncKey}</span>
              <button onClick={handleLogout} className="ml-2 hover:text-red-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              {showSyncInput ? (
                <div className="flex gap-2 bg-white/10 backdrop-blur p-1 rounded-lg animate-in fade-in slide-in-from-right-4">
                  <Input 
                    placeholder="Sua Chave Secreta" 
                    value={tempSyncKey}
                    onChange={e => setTempSyncKey(e.target.value)}
                    className="w-40 h-8 bg-white/90 text-black text-sm border-none"
                  />
                  <Button size="sm" onClick={handleSyncKeySubmit} className="h-8 bg-green-600 hover:bg-green-700 text-white">
                    Entrar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowSyncInput(false)} className="h-8 text-white hover:bg-white/20">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowSyncInput(true)}
                  className="bg-blue-600/80 hover:bg-blue-700 backdrop-blur text-white shadow-lg border border-blue-400/30"
                >
                  <Key className="w-4 h-4 mr-2" /> Sincronizar
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Card Principal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-2xl overflow-hidden border-2 md:border-4 border-yellow-400/30">
          {/* Header do Card */}
          <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 px-4 md:px-8 py-4 md:py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-4xl font-black text-black drop-shadow-lg">
                  📊 Mohamed Pokas Ideias
                </h1>
                <p className="text-xs md:text-sm text-black/80 font-semibold mt-1">
                  {new Date().toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <Button
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-sm md:text-lg px-6 py-2 md:py-3 rounded-lg shadow-lg"
                onClick={clearDayData}
              >
                🧹 Limpar Dados
              </Button>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-3 md:p-8">
            {/* Formulário de Entrada */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 md:p-6 rounded-xl mb-6 md:mb-8 border-2 border-yellow-400/20">
              <form onSubmit={handleAddBoss} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Nome do Patrão:</label>
                    <Input
                      placeholder="Ex: João Silva"
                      value={bossName}
                      onChange={(e) => setBossName(e.target.value)}
                      className="bg-white border-2 border-yellow-400/50 focus:border-yellow-500 font-semibold text-black placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Minha Porcentagem (%):</label>
                    <Input
                      type="number"
                      placeholder="Ex: 10"
                      min="0"
                      max="100"
                      step="0.01"
                      value={bossPercentage}
                      onChange={(e) => setBossPercentage(e.target.value)}
                      className="bg-white border-2 border-yellow-400/50 focus:border-yellow-500 font-semibold text-black placeholder:text-gray-400"
                    />
                  </div>
                  <div className="hidden md:block"></div>
                </div>

                {/* Área de Funcionários */}
                <div className="bg-white/50 p-3 md:p-4 rounded-lg border border-yellow-400/30">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Adicionar Funcionários (Opcional)</label>
                  <div className="flex flex-col md:flex-row gap-2 items-end mb-3">
                    <div className="w-full md:w-1/3">
                      <Input
                        placeholder="Nome Funcionário"
                        value={empName}
                        onChange={(e) => setEmpName(e.target.value)}
                        className="bg-white border-gray-300 h-9 text-sm text-black"
                      />
                    </div>
                    <div className="w-full md:w-24 flex gap-2">
                      <Input
                        type="number"
                        placeholder="%"
                        value={empPercentage}
                        onChange={(e) => setEmpPercentage(e.target.value)}
                        className="bg-white border-gray-300 h-9 text-sm flex-1 text-black"
                      />
                      <Button 
                        type="button"
                        onClick={handleAddEmployee}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-3 md:hidden"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      type="button"
                      onClick={handleAddEmployee}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-3 hidden md:flex"
                    >
                      <UserPlus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>

                  {/* Lista de Funcionários Adicionados */}
                  {newEmployees.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newEmployees.map(emp => (
                        <div key={emp.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 border border-blue-200">
                          {emp.name} ({emp.percentage}%)
                          <button type="button" onClick={() => removeNewEmployee(emp.id)} className="text-blue-600 hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-lg py-4 md:py-6 rounded-lg shadow-lg"
                >
                  💾 Salvar Patrão
                </Button>
              </form>
            </div>

            {/* Lista de Patrões */}
            {state.bosses.length === 0 ? (
              <div className="p-8 md:p-12 text-center space-y-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-xl md:text-2xl font-bold text-gray-600">📭 Nenhum patrão cadastrado</p>
                <p className="text-sm md:text-base text-gray-500 font-semibold">
                  Preencha o formulário acima e clique em "Salvar Patrão" para começar.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Visualização Desktop (Tabela) */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-800 text-white uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Patrão</th>
                        <th className="px-4 py-3">Valores (R$)</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-right">Meu Ganho</th>
                        <th className="px-4 py-3 text-right">Funcionários</th>
                        <th className="px-4 py-3 text-right">Repasse</th>
                        <th className="px-4 py-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {state.bosses.map((boss) => {
                        const bossTotal = boss.values.reduce((a, b) => a + b, 0);
                        const myShare = bossTotal * (boss.percentage / 100);
                        
                        let employeesShare = 0;
                        boss.employees.forEach(emp => {
                          employeesShare += bossTotal * (emp.percentage / 100);
                        });

                        const totalDeductions = myShare + employeesShare;
                        const bossShare = bossTotal - totalDeductions;
                        const remainingToSend = bossShare - (boss.amountSent || 0);

                        return (
                          <tr key={boss.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-bold text-gray-900">
                              {boss.name}
                              <div className="text-xs text-gray-500 font-normal">Minha %: {boss.percentage}%</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 mb-2 max-w-[200px]">
                                {boss.values.map((val, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-red-100 hover:text-red-800 transition-colors"
                                    onClick={() => removeValue(boss.id, idx)}
                                    title="Clique para remover"
                                  >
                                    {val}
                                  </span>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Valor"
                                  className="w-24 h-8 text-sm text-black"
                                  value={valuesInput[boss.id] || ''}
                                  onChange={(e) => handleInputChange(boss.id, e.target.value)}
                                  onKeyDown={(e) => handleKeyPress(e, boss.id)}
                                />
                                <Button
                                  size="sm"
                                  className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleAddValues(boss.id)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                              R$ {bossTotal.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-blue-600 bg-blue-50/50">
                              R$ {myShare.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="font-bold text-purple-600">R$ {employeesShare.toFixed(2)}</div>
                              {boss.employees.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {boss.employees.map(emp => (
                                    <div key={emp.id}>{emp.name}: R$ {(bossTotal * (emp.percentage/100)).toFixed(2)}</div>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="font-bold text-green-600 text-lg">R$ {bossShare.toFixed(2)}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Enviado: R$ {(boss.amountSent || 0).toFixed(2)}
                              </div>
                              <div className="text-xs font-bold text-red-500">
                                Resta: R$ {remainingToSend.toFixed(2)}
                              </div>
                              <div className="mt-2 flex gap-1">
                                <Input
                                  type="number"
                                  placeholder="Enviado"
                                  className="w-20 h-6 text-xs text-black bg-white border-gray-300"
                                  value={sentAmountInput[boss.id] || ''}
                                  onChange={(e) => setSentAmountInput({ ...sentAmountInput, [boss.id]: e.target.value })}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      const val = parseFloat(sentAmountInput[boss.id]);
                                      if (!isNaN(val) && val > 0) {
                                        markAsSent(boss.id, val);
                                        setSentAmountInput({ ...sentAmountInput, [boss.id]: '' });
                                      }
                                    }
                                  }}
                                />
                                <Button 
                                  size="sm" 
                                  className="h-6 px-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                                  onClick={() => {
                                    const val = parseFloat(sentAmountInput[boss.id]);
                                    if (!isNaN(val) && val > 0) {
                                      markAsSent(boss.id, val);
                                      setSentAmountInput({ ...sentAmountInput, [boss.id]: '' });
                                    }
                                  }}
                                >
                                  OK
                                </Button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeBoss(boss.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Visualização Mobile (Cards) */}
                <div className="md:hidden space-y-4">
                  {state.bosses.map((boss) => {
                    const bossTotal = boss.values.reduce((a, b) => a + b, 0);
                    const myShare = bossTotal * (boss.percentage / 100);
                    
                    let employeesShare = 0;
                    boss.employees.forEach(emp => {
                      employeesShare += bossTotal * (emp.percentage / 100);
                    });

                    const totalDeductions = myShare + employeesShare;
                    const bossShare = bossTotal - totalDeductions;
                    const remainingToSend = bossShare - (boss.amountSent || 0);
                    const isExpanded = expandedBossId === boss.id;

                    return (
                      <div key={boss.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                        {/* Cabeçalho do Card */}
                        <div 
                          className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
                          onClick={() => toggleExpand(boss.id)}
                        >
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{boss.name}</h3>
                            <div className="text-xs text-gray-500">Minha parte: {boss.percentage}%</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Repasse</div>
                              <div className="font-bold text-green-600">R$ {bossShare.toFixed(2)}</div>
                            </div>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                          </div>
                        </div>

                        {/* Corpo do Card (Expandido) */}
                        {isExpanded && (
                          <div className="p-4 space-y-4 border-t border-gray-100">
                            {/* Valores */}
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase">Valores Recebidos</label>
                              <div className="flex flex-wrap gap-2 my-2">
                                {boss.values.map((val, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                                    onClick={() => removeValue(boss.id, idx)}
                                  >
                                    {val} <X className="w-3 h-3 ml-1 opacity-50" />
                                  </span>
                                ))}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Input
                                  placeholder="Valor"
                                  className="flex-1 h-10 text-black"
                                  value={valuesInput[boss.id] || ''}
                                  onChange={(e) => handleInputChange(boss.id, e.target.value)}
                                  onKeyDown={(e) => handleKeyPress(e, boss.id)}
                                />
                                <Button
                                  className="h-10 w-12 bg-green-600 text-white"
                                  onClick={() => handleAddValues(boss.id)}
                                >
                                  <Plus className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>

                            {/* Resumo Financeiro */}
                            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg">
                              <div>
                                <div className="text-xs text-gray-500">Total Bruto</div>
                                <div className="font-bold text-gray-900">R$ {bossTotal.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-xs text-blue-600 font-bold">Meu Ganho</div>
                                <div className="font-bold text-blue-700">R$ {myShare.toFixed(2)}</div>
                              </div>
                              <div className="col-span-2 border-t border-gray-200 pt-2 mt-1">
                                <div className="flex justify-between items-center">
                                  <div className="text-xs text-purple-600 font-bold">Funcionários</div>
                                  <div className="font-bold text-purple-700">R$ {employeesShare.toFixed(2)}</div>
                                </div>
                                {boss.employees.length > 0 && (
                                  <div className="mt-1 space-y-1">
                                    {boss.employees.map(emp => (
                                      <div key={emp.id} className="flex justify-between text-xs text-gray-500">
                                        <span>{emp.name} ({emp.percentage}%)</span>
                                        <span>R$ {(bossTotal * (emp.percentage/100)).toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {/* Área de Repasse Enviado (Mobile) */}
                              <div className="col-span-2 border-t border-gray-200 pt-2 mt-1 bg-green-50 p-2 rounded">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="text-xs text-green-800 font-bold uppercase">Repasse</div>
                                  <div className="text-right">
                                    <div className="text-xs text-gray-500">Enviado: <span className="font-bold text-green-700">R$ {(boss.amountSent || 0).toFixed(2)}</span></div>
                                    <div className="text-xs text-gray-500">Resta: <span className="font-bold text-red-600">R$ {(bossShare - (boss.amountSent || 0)).toFixed(2)}</span></div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Valor"
                                    className="bg-white border-green-200 text-black h-8 text-sm w-full"
                                    value={sentAmountInput[boss.id] || ''}
                                    onChange={(e) => setSentAmountInput({ ...sentAmountInput, [boss.id]: e.target.value })}
                                  />
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
                                    onClick={() => {
                                      const val = parseFloat(sentAmountInput[boss.id]);
                                      if (!isNaN(val) && val > 0) {
                                        markAsSent(boss.id, val);
                                        setSentAmountInput({ ...sentAmountInput, [boss.id]: '' });
                                      }
                                    }}
                                  >
                                    OK
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Ações */}
                            <div className="pt-2 flex justify-end">
                              <Button
                                variant="destructive"
                                size="sm"
                                className="w-full"
                                onClick={() => removeBoss(boss.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Remover Patrão
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resumo Geral */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 text-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                <p className="text-sm text-gray-400 uppercase font-bold">Total Geral</p>
                <p className="text-2xl md:text-3xl font-black text-yellow-400">R$ {state.totalGeneral.toFixed(2)}</p>
              </div>
              <div className="bg-blue-900 text-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-200 uppercase font-bold">Meu Lucro</p>
                <p className="text-2xl md:text-3xl font-black text-white">R$ {state.myEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-purple-900 text-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                <p className="text-sm text-purple-200 uppercase font-bold">Total Funcionários</p>
                <p className="text-2xl md:text-3xl font-black text-white">R$ {state.employeesEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-green-900 text-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-sm text-green-200 uppercase font-bold">Total Repasse</p>
                <p className="text-2xl md:text-3xl font-black text-white">R$ {state.totalSentToBosses.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
