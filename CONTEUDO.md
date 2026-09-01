# Mundo Mágico da Antonella — Conteúdo do Projeto

Jogo educativo web para alfabetização, com narração em voz e abordagens de
educação inclusiva (método fônico, TEACCH, PECS, ABA). Sem frameworks nem
dependências externas além da fonte Google Fredoka.

## Estrutura de arquivos

```
antonella-game/
├── index.html          Todas as telas (menu, jogo, fases, caçada)
├── css/style.css       Visual, responsividade mobile, acessibilidade
├── audio/              9 MP3 de voz premium + LEIA-ME.txt
└── js/
    ├── voz.js          Narração pt-BR + áudio pré-gravado (com fallback)
    ├── microfone.js    Reconhecimento de fala (exercício de falar)
    ├── confete.js      Animação de confete ao acertar
    ├── fase1.js        MOTOR do modo "Jogar" (8 tipos de exercício)
    ├── fases.js        CONTEÚDO do modo "Jogar" (14 fases)
    ├── temas.js        CONTEÚDO da Caçada dos Sons (4 temas)
    ├── cacada.js       MOTOR da Caçada dos Sons
    ├── painel.js       Painel do educador (métricas e relatório)
    └── jogo.js         Orquestrador (telas, botões, placar)
```

## As 8 mecânicas de exercício (motor)

| Tipo | O que faz |
|------|-----------|
| `fonico` | Achar o card que começa com a letra/sílaba |
| `arrasta` | Montar a palavra arrastando a sílaba certa |
| `microfone` | Falar o nome do que aparece na tela |
| `contar` | Escolher quantas sílabas tem a palavra |
| `parear` | Achar a mesma palavra em MAIÚSCULA/minúscula |
| `sinonimo` | Achar a palavra que quer dizer o mesmo |
| `tamanho` | Achar a palavra escrita grande ou pequena |
| `separar` | Achar onde fica o espaço entre palavras grudadas |

---

## MODO JOGAR — 17 fases (em ordem de dificuldade)

### Nível 1 — Sons e letras iniciais

**★ Fase 1: O Jardim da Antonella** 🌷
- Achar **BORBOLETA** (letra B) — entre borboleta, flor, sol
- Montar **GATO** (sílaba GA)
- Falar **PATO**

**2. Gato, Rato e Pato** 🐱
- Achar **GATO** (letra G) — entre gato, rato, pato
- Achar **RATO** (letra R) — entre rato, pato, gato
- Montar **PATO** (sílaba PA)
- Falar **GATO**

**3. Maluquinhos por Bicho** 😺 (baseada na HQ do livro)
- Achar **GATO** (letra G) — o bicho que espanta o rato, entre gato, rato, osso
- Achar a letra **R** de RAMIRO — entre R, M, G
- Montar **GATURRO** (sílaba GA) — o outro gato personagem
- Achar **RATO** — o animal que o gato persegue, entre rato, abelha, passarinho
- Falar **GATO**

**4. Como Ele Se Sente?** 😊 (emoções — baseada nas expressões da HQ)
- Achar quem está **FELIZ** 😄 — entre feliz, triste, bravo
- Achar quem está **COM MEDO** 😱 — o rato apavorado, entre com medo, feliz, surpreso
- Achar quem está **TRISTE** 😢 — entre triste, feliz, com medo
- Achar quem está **BRAVO** 😠 — entre bravo, triste, feliz

**5. Que Som É Esse?** 🔊 (onomatopeias — baseada no "ligue o som ao animal")
- Quem faz **MIAU** → gato 🐱
- Quem faz **QUÁ-QUÁ** → pato 🦆
- Quem faz **AUUU** → lobo 🐺
- Quem faz **OINC-OINC** → porco 🐷

**6. Sons da Fazenda** 🐄
- Achar **VACA** (som VA) — entre vaca, porco, galo
- Achar **GALO** (som GA) — entre galo, cavalo, ovelha
- Achar **PORCO** (som PO) — entre porco, pato, vaca
- Achar **CAVALO** (som CA) — entre cavalo, galo, ovelha

**7. Caça às Letras** 🔤 (primeira letra do nome)
- Achar **A** de ANTONELLA — entre A, O, E
- Achar **B** de BERNARDO — entre B, D, P
- Achar **M** de MIA — entre M, N, I
- Achar **L** de LUCAS — entre L, U, C

### Nível 2 — Sílabas: contar e montar

**8. Sílabas Sonoras** 👏 (contar sílabas)
- **QUEIJO** (QUEI-JO = 2)
- **ROSCA** (ROS-CA = 2)
- **CEBOLA** (CE-BO-LA = 3)
- **ABACAXI** (A-BA-CA-XI = 4)
- Montar **MILHO** (sílaba MI)

**9. Quantas Sílabas?** 🍎 (discriminar por nº de sílabas)
- Achar 1 sílaba: **PÃO** — entre pão, bolo, peixe
- Achar 2 sílabas: **MAÇÃ** — entre maçã, banana, laranja
- Achar 3 sílabas: **TOMATE** — entre tomate, melancia, berinjela
- Contar **BERINJELA** (BE-RIN-JE-LA = 4)

**10. Brincando com Sílabas** 🧩
- Achar **RATO** (som RA) — entre rato, sol, bola
- Montar **TÊNIS** (sílaba TÊ)
- Montar **BLUSA** (sílaba BLU)
- Montar **COROA** (sílaba CO)

**11. Montar a Palavra** 🍌
- Montar **BANANA** (sílaba BA)
- Montar **LARANJA** (sílaba LA)
- Montar **BOLA** (sílaba BO)
- Montar **UVA** (letra U)

**12. O Título e Meu Nome** 🌟
- Achar o **sinal de pergunta (?)** — entre ?, !, .
- Montar **ANTONELLA** em 4 partes: AN → TO → NE → LLA

### Nível 3 — Percepção do texto

**13. Tipos de Letras** 🔠 (maiúscula ↔ minúscula)
- Parear **SORVETE** → sorvete
- Parear **CENOURA** → cenoura
- Parear **ABACATE** → abacate
- Achar a letra **R** — entre R, P, B
- Montar **RATO** (sílaba RA)

**14. Grande ou Pequeno?** 🔎 (tamanho da palavra)
- **SOL** grande / **GATO** pequeno / **BOLA** grande / **FLOR** pequeno

**15. Cadê o Espaço?** ✂️ (espaçamento entre palavras)
- **OGATO** → O GATO
- **OSOL** → O SOL
- **ABOLA** → A BOLA
- **OPATO** → O PATO

### Nível 4 — Revisão e vocabulário

**16. O Ratinho Esperto** 🐭 (revisão — usa 5 mecânicas)
- Achar **RATO** (letra R) / Contar **RATO** (2) / Parear **RATO** → rato /
  Falar **RATO** / Montar **QUEIJO**

**17. Palavras Amigas** 💬 (sinônimos)
- **BONITO** → LINDO (distratores: feio, grande)
- **FELIZ** → ALEGRE (triste, cansado)
- **GRANDE** → ENORME (pequeno, rápido)
- **RÁPIDO** → LIGEIRO (devagar, bonito)

---

## A CAÇADA DOS SONS — 4 temas

Fluxo por palavra (rotina TEACCH):
**Procurar** a figura → **Ouvir** o fonema → **Montar** as letras → **Prêmio** (minijogo de 15 s).

**Dinossauros** 🦕 — minijogo: alimentar o dino 🍖
- **LAMA** (monta L) / **LAGO** (monta LA) / **LAGARTO** (monta L)

**Carros** 🚗 — minijogo: abastecer o carro ⛽
- **RODA** (monta R) / **CARRO** (monta CA) / **ONIBUS** (monta O)

**Animais** 🦁 — minijogo: alimentar o leão 🥩
- **GATO** (monta G) / **PATO** (monta PA) / **ELEFANTE** (monta E)

**O Rato Guloso** 🐭 — minijogo: dar queijo ao rato 🧀
- **RATO** (monta R) / **LEITE** (monta LE) / **BACON** (monta B)

---

## Resumo numérico

- **2 modos de jogo**: Jogar (fases-história) e Caçada dos Sons
- **17 fases** no modo Jogar + **4 temas** na Caçada
- **8 mecânicas** de exercício diferentes
- **~75 desafios** no total (71 cenas nas fases + montagem das palavras da Caçada)
- **9 áudios de voz premium** gravados; o restante usa a voz do navegador
- Conteúdo trabalhado: animais, frutas/alimentos, objetos, o próprio nome
  ANTONELLA, pontuação, sinônimos e antônimos
