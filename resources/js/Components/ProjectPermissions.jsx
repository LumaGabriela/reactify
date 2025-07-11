import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

export function ProjectPermissions({ projectId, ownerId }) {
  const { auth } = usePage().props;
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState('');

  // Variável de controle de permissão
  const canManagePermissions = currentUserRole === 'admin';

  // Função para buscar os usuários do projeto
  const fetchPermissions = async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/projects/${projectId}/permissions`);
      setUsers(response.data);
      
      const currentUser = response.data.find(user => user.id === auth.user.id);
      if (currentUser) {
        setCurrentUserRole(currentUser.role);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para salvar as alterações
  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/projects/${projectId}/permissions`, { users });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para alterar o papel de um usuário
  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };
  
  // Função para remover um usuário
  const handleRemoveUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Efeito para buscar os dados quando o sheet for aberto
  useEffect(() => {
    if (isOpen) {
      fetchPermissions();
    }
  }, [isOpen, projectId]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Gerenciar Permissões</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-foreground">Gerenciar Permissões</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {currentUserRole && `(${currentUserRole})`} <br/>
            {canManagePermissions 
              ? 'Adicione, remova ou edite o acesso dos membros a este projeto.'
              : 'Você pode visualizar os membros do projeto.'}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          {isLoading && <p className="text-muted-foreground">Carregando...</p>}
          {!isLoading && users.filter(user => user.id !== auth.user.id).map((user) => {
            const isOwner = user.id == ownerId && user.role === 'admin';
            return (
            <div key={user.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select 
                  value={user.role} 
                  onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                  disabled={!canManagePermissions || isOwner}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveUser(user.id)}
                  disabled={!canManagePermissions || isOwner}
                >
                  X
                </Button>
              </div>
            </div>
          )})}
        </div>
        {canManagePermissions && (
          <SheetFooter>
              <div className="flex flex-col w-full gap-2">
                  <SheetClose asChild>
                      <Button variant="outline">Cancelar</Button>
                  </SheetClose>
                  <Button onClick={handleSaveChanges} disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
              </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
