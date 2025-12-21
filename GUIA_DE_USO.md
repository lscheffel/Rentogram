# Guia de Uso do Rentogram

Este guia fornece instruções detalhadas sobre como usar o sistema Rentogram para gerenciar propriedades e reservas.

## Índice

1. [Acesso ao Sistema](#acesso-ao-sistema)
2. [Gestão de Propriedades](#gestão-de-propriedades)
   - [Visão Geral](#visão-geral)
   - [Cadastro de Propriedade](#cadastro-de-propriedade)
   - [Edição de Propriedade](#edição-de-propriedade)
   - [Exclusão de Propriedade](#exclusão-de-propriedade)
   - [Visualização de Propriedades](#visualização-de-propriedades)
3. [Gestão de Reservas](#gestão-de-reservas)
   - [Visão Geral](#visão-geral-1)
   - [Criação de Reserva](#criação-de-reserva)
   - [Edição de Reserva](#edição-de-reserva)
   - [Exclusão de Reserva](#exclusão-de-reserva)
   - [Visualização de Reservas](#visualização-de-reservas)
4. [Dashboard](#dashboard)
   - [Calendário de Reservas](#calendário-de-reservas)
   - [Estatísticas](#estatísticas)
   - [Próximas Reservas](#próximas-reservas)
5. [Melhores Práticas](#melhores-práticas)
6. [Solução de Problemas](#solução-de-problemas)

## Acesso ao Sistema

1. **Iniciar o sistema:**
   - Certifique-se de que o backend e o frontend estão em execução
   - Acesse o frontend em `http://localhost:5173` (ou a porta configurada)

2. **Login:**
   - Atualmente, o sistema não possui autenticação (pode ser implementada)
   - A interface principal será exibida automaticamente

## Gestão de Propriedades

### Visão Geral

A seção de propriedades permite:
- Cadastrar novas propriedades para locação
- Editar informações de propriedades existentes
- Excluir propriedades
- Visualizar todas as propriedades cadastradas

### Cadastro de Propriedade

1. **Acessar a página de propriedades:**
   - Clique em "Imóveis" no menu de navegação

2. **Iniciar cadastro:**
   - Clique no botão "Nova Propriedade" ou similar

3. **Preencher informações:**
   - **Título:** Nome da propriedade (ex: "Apartamento Centro")
   - **Descrição:** Detalhes sobre a propriedade
   - **Endereço:** Localização completa
   - **Preço por noite:** Valor em reais (ex: 250.00)
   - **Quartos:** Número de quartos
   - **Banheiros:** Número de banheiros
   - **Máximo de hóspedes:** Capacidade máxima
   - **Comodidades:** Lista de comodidades (ex: "Wi-Fi, Piscina, Estacionamento")
   - **URL da imagem:** Link para uma imagem da propriedade

4. **Salvar propriedade:**
   - Clique em "Salvar" ou "Cadastrar"
   - A propriedade será adicionada ao sistema

**Exemplo de cadastro:**
```json
{
  "title": "Casa de Praia",
  "description": "Casa espaçosa com vista para o mar",
  "address": "Rua das Palmeiras, 123, Florianópolis",
  "price_per_night": 450.00,
  "bedrooms": 3,
  "bathrooms": 2,
  "max_guests": 6,
  "amenities": "Wi-Fi, Piscina, Churrasqueira, Estacionamento",
  "image_url": "https://exemplo.com/casa-praia.jpg"
}
```

### Edição de Propriedade

1. **Localizar propriedade:**
   - Na lista de propriedades, encontre a que deseja editar

2. **Iniciar edição:**
   - Clique no botão "Editar" ao lado da propriedade

3. **Atualizar informações:**
   - Modifique os campos necessários
   - Todos os campos são editáveis

4. **Salvar alterações:**
   - Clique em "Atualizar" ou "Salvar"

### Exclusão de Propriedade

1. **Localizar propriedade:**
   - Na lista de propriedades, encontre a que deseja excluir

2. **Iniciar exclusão:**
   - Clique no botão "Excluir" ao lado da propriedade

3. **Confirmar exclusão:**
   - Uma mensagem de confirmação será exibida
   - Clique em "Confirmar" para excluir permanentemente

**Atenção:**
- A exclusão de uma propriedade também excluirá todas as reservas associadas
- Esta ação não pode ser desfeita

### Visualização de Propriedades

1. **Lista de propriedades:**
   - Todas as propriedades são exibidas em uma tabela
   - Informações exibidas: Título, Endereço, Preço, Quartos, Banheiros

2. **Detalhes da propriedade:**
   - Clique em uma propriedade para ver detalhes completos
   - Inclui descrição, comodidades e imagem

## Gestão de Reservas

### Visão Geral

A seção de reservas permite:
- Criar novas reservas para propriedades
- Editar informações de reservas existentes
- Excluir reservas
- Visualizar todas as reservas

### Criação de Reserva

1. **Acessar a página de reservas:**
   - Clique em "Reservas" no menu de navegação

2. **Iniciar cadastro:**
   - Clique no botão "Nova Reserva"

3. **Preencher informações:**
   - **Imóvel:** Selecione uma propriedade do dropdown
   - **Data de início:** Data de check-in
   - **Data de término:** Data de check-out
   - **Nome do hóspede:** Nome completo
   - **Email do hóspede:** Email válido

4. **Salvar reserva:**
   - Clique em "Salvar" ou "Cadastrar"
   - A reserva será adicionada ao sistema

**Exemplo de cadastro:**
```json
{
  "propertyId": 1,
  "startDate": "2023-12-15",
  "endDate": "2023-12-20",
  "guestName": "João Silva",
  "guestEmail": "joao@example.com"
}
```

### Edição de Reserva

1. **Localizar reserva:**
   - Na lista de reservas, encontre a que deseja editar

2. **Iniciar edição:**
   - Clique no botão "Editar" ao lado da reserva

3. **Atualizar informações:**
   - Modifique os campos necessários
   - É possível alterar o imóvel, datas ou informações do hóspede

4. **Salvar alterações:**
   - Clique em "Atualizar" ou "Salvar"

### Exclusão de Reserva

1. **Localizar reserva:**
   - Na lista de reservas, encontre a que deseja excluir

2. **Iniciar exclusão:**
   - Clique no botão "Excluir" ao lado da reserva

3. **Confirmar exclusão:**
   - Uma mensagem de confirmação será exibida
   - Clique em "Confirmar" para excluir permanentemente

### Visualização de Reservas

1. **Lista de reservas:**
   - Todas as reservas são exibidas em uma tabela
   - Informações exibidas: Imóvel, Hóspede, Período

2. **Detalhes da reserva:**
   - Clique em uma reserva para ver detalhes completos
   - Inclui datas, informações do hóspede e status

## Dashboard

### Calendário de Reservas

1. **Visualização:**
   - O calendário exibe todas as reservas em um formato mensal
   - Cada reserva é representada como um evento no calendário

2. **Interação:**
   - Clique em um evento para ver detalhes da reserva
   - Navegue entre meses usando os controles do calendário

3. **Legenda:**
   - Diferentes cores podem representar diferentes status de reserva

### Estatísticas

1. **Total de Imóveis:**
   - Número total de propriedades cadastradas

2. **Total de Reservas:**
   - Número total de reservas ativas

3. **Taxa de Ocupação:**
   - Porcentagem de imóveis ocupados
   - Calculada como: (Imóveis com reservas / Total de imóveis) × 100

### Próximas Reservas

1. **Lista:**
   - Exibe as próximas 5 reservas
   - Ordenadas por data de início

2. **Informações:**
   - Nome do hóspede
   - Data de início
   - ID do imóvel

## Melhores Práticas

### Gestão de Propriedades

1. **Informações completas:**
   - Preencha todos os campos ao cadastrar uma propriedade
   - Descrições detalhadas ajudam na gestão

2. **Imagens de qualidade:**
   - Use imagens claras e de alta qualidade
   - Certifique-se de que a URL da imagem é acessível

3. **Atualização regular:**
   - Mantenha as informações das propriedades atualizadas
   - Atualize preços e disponibilidade conforme necessário

### Gestão de Reservas

1. **Verificação de datas:**
   - Certifique-se de que as datas de check-in e check-out são válidas
   - Evite sobreposição de reservas para a mesma propriedade

2. **Informações do hóspede:**
   - Colete informações precisas dos hóspedes
   - Email válido é essencial para comunicação

3. **Confirmação:**
   - Sempre confirme as reservas com os hóspedes
   - Envie um email de confirmação (funcionalidade a ser implementada)

### Uso do Sistema

1. **Backup regular:**
   - Faça backup do banco de dados regularmente
   - Exportar dados periodicamente

2. **Monitoramento:**
   - Verifique o dashboard diariamente
   - Acompanhe as estatísticas de ocupação

3. **Atualizações:**
   - Mantenha o sistema atualizado
   - Aplique correções e melhorias conforme necessário

## Solução de Problemas

### Problemas com Propriedades

1. **Propriedade não aparece na lista:**
   - Verifique se a propriedade foi salva corretamente
   - Atualize a página
   - Confira se não há erros no console do navegador

2. **Erro ao salvar propriedade:**
   - Verifique se todos os campos obrigatórios estão preenchidos
   - Certifique-se de que os valores numéricos são válidos
   - Confira a conexão com o backend

### Problemas com Reservas

1. **Reserva não aparece na lista:**
   - Verifique se a reserva foi salva corretamente
   - Atualize a página
   - Confira se a propriedade selecionada existe

2. **Conflito de datas:**
   - Verifique se não há outra reserva para a mesma propriedade no mesmo período
   - Use o calendário para visualizar reservas existentes

3. **Erro ao salvar reserva:**
   - Verifique se todos os campos obrigatórios estão preenchidos
   - Certifique-se de que o email do hóspede é válido
   - Confira a conexão com o backend

### Problemas Gerais

1. **Sistema lento:**
   - Verifique a conexão com a internet
   - Limpe o cache do navegador
   - Reinicie o backend e o frontend

2. **Erro de conexão:**
   - Certifique-se de que o backend está em execução
   - Verifique a URL da API no arquivo de configuração
   - Confira se o CORS está configurado corretamente

3. **Dados não sincronizados:**
   - Atualize a página
   - Verifique se o backend está respondendo
   - Confira se não há erros no console

## Contato e Suporte

Para problemas persistentes ou dúvidas:
- Consulte a documentação técnica
- Verifique os logs do servidor
- Entre em contato com o administrador do sistema

## Anexos

### Exemplo de Fluxo de Trabalho

1. **Cadastro de propriedade:**
   - Acesse a página de propriedades
   - Clique em "Nova Propriedade"
   - Preencha os campos
   - Salve a propriedade

2. **Criação de reserva:**
   - Acesse a página de reservas
   - Clique em "Nova Reserva"
   - Selecione a propriedade
   - Preencha as datas e informações do hóspede
   - Salve a reserva

3. **Monitoramento:**
   - Acesse o dashboard
   - Verifique o calendário de reservas
   - Acompanhe as estatísticas

Este guia deve ser atualizado conforme novas funcionalidades são adicionadas ao sistema.