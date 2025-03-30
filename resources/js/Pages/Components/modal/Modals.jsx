import { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { nanoid } from 'nanoid'
import { RemoveButton } from '../button/Buttons'
import './Modals.css'

const AddProjectModal = ({ modal, userKey, users, setUsers, handleRemove }) => {
  const [projectField, setProjectField] = useState({})

  // Salva o nome do projeto no objeto principal
  const setProjectName = () => {
    const user = users.find(user => user.key === userKey);
    const updatedUserData = {
      ...user,
      projects: [...user.projects, {
        goalSketches: [],
        journeys: [],
        key: nanoid(),
        name: projectField.name,
        personas: [],
        stories: [],
        productCanvas: {},
        visaoGeral: projectField.description,

      }]
    }
    setUsers(users.map(user => user.key === userKey ? updatedUserData : user));

    // Update user in users array
    const updatedUsers = users.map(user =>
      user.key === userKey ? { ...user, projects: updatedUserData.projects } : user
    );
    setUsers(updatedUsers);

    setProjectField({ ...projectField, name: '' })
    handleRemove('project')
  }

  // Printa os dados do objeto toda vez que ele é alterado


  return (
    <div
      className={"modal show "}
      style={{ display: modal.project ? 'block' : 'none', position: 'absolute', background: '#00000080' }}
    >
      <Modal.Dialog style={{ marginTop: '6rem' }}>
        <Modal.Header closeButton onClick={() => handleRemove('project')}>
          <Modal.Title>Criar Projeto</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Nome do projeto: </p>
          <Form.Control
            type="text"
            value={projectField.name}
            onKeyUp={(e) => { if (e.key === 'Enter') setProjectName() }}
            onChange={(e) => setProjectField({ ...projectField, name: e.target.value })}
            placeholder="Nome do projeto"
            style={{ cursor: 'text' }}
          />
          <p>Descrição: </p>
          <Form.Control
            type="text"
            value={projectField.description}
            onKeyUp={(e) => { if (e.key === 'Enter') setProjectName() }}
            onChange={(e) => setProjectField({ ...projectField, description: e.target.value })}
            placeholder="Descrição do projeto"
            style={{ cursor: 'text' }}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setProjectName()}>Salvar</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

const JourneyDescriptionModal = ({ userKey, users, setUsers, handleRemove, modal, projectKey, journeyData, setJourneyData, operation, setOperation }) => {
  const [jValue, setJValue] = useState('')
  const [touchPoint, setTouchPoint] = useState(false)
  const [removeType, setRemoveType] = useState('')
  const [bodyHeight, setBodyHeight] = useState('100%');

  const [project, setProject] = useState(null)
  //Atualiza o projeto atual
  useEffect(() => {
    const user = users.find(user => user.key === userKey);
    setProject(user?.projects.find(project => project.key === projectKey) || {});
  }, [users, userKey, projectKey])
  // Torna a altura da sombra do modal variável
  useEffect(() => {
    const height = document.body.scrollHeight;
    setBodyHeight(`${height * 1.2}px`)
    // Se o modal está fechado, redefine os valores da journey
    if (!modal.journeys) {
      setJourneyData({})
      setJValue('')
    }
  }, [modal.journeys]);

  // Define o tipo de botão remove
  useEffect(() => {
    switch (operation) {
      case 'remove-journey': setRemoveType(operation)
        break
      case 'description': setRemoveType('remove-journey-step')
        break
      default: setRemoveType('')
    }
  }, [operation])

  // Define o valor de operation
  useEffect(() => {
    // Caso haja valor prévio (remove ou add-step), manter o valor
    if (operation !== '' && Object.keys(journeyData).length !== 0) void 0
    // Caso não e o journeyData tenha valores definidos, operação será atualizar descrição
    else if (Object.keys(journeyData).length !== 0) setOperation('description')
    // Do contrário, a operação será de adicionar uma nova journey
    else setOperation('name')
  }, [journeyData])
  //
  useEffect(() => {
    // Define sValue para ser o título da story clicada
    let foundStep = null;
    const user = users.find(user => user.key === userKey);
    user.projects.forEach(proj => {
      if (proj.key === projectKey) {
        proj.journeys.forEach((journey, index) => {
          if (index === journeyData.journeyindex) {
            journey.steps.forEach((step, i)=> {
              if(i === journeyData.stepindex) 
                foundStep = step
            })
          }
        });
      }
    })
    setJValue(foundStep?.description)
    setTouchPoint(foundStep?.touchpoint)
  }, [journeyData, modal.journeys])

  // Seletor de valores para o placeholder
  const getPlaceholder = () => {
    if (operation === 'add-step') {
      return 'Descreva o passo';
    } else if (operation === 'description' && Object.keys(journeyData).length > 0) {
      return 'Descreva o passo';
    } else if (operation === 'name') {
      return 'Nome da jornada';
    } else {
      return 'Digite aqui';
    }
  }

  // Seletor de valores para o título
  const getTitle = () => {
    if (operation === 'add-step') {
      return 'Adicionar novo passo';
    } else if (operation === 'description' && Object.keys(journeyData).length > 0) {
      return `Editar passo: ${project.journeys[journeyData.journeyindex]?.steps[journeyData.stepindex]?.description}`
    } else if (operation === 'name') {
      return 'Nome da jornada';
    } else if (operation === 'remove-journey') {
      return 'Deseja remover a jornada?'
    }
  }

  // Atualiza o array das journeys
  const updateJourney = (op) => {
    const operationType = (op ? op : operation)
    const user = users.find(user => user.key === userKey);
    switch (operationType) {
      // Adiciona uma journey
      case 'name': {
        const newJourney = {
          name: jValue,
          steps: []
        };


        const updatedUserData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              return { ...proj, journeys: [...proj.journeys, newJourney] };
            }
            return proj;
          })
        };

        setUsers(users.map(user => user.key === userKey ? updatedUserData : user));


      }
        break;

      // Atualiza a descrição de uma journey
      case 'description': {
        const updatedUserData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              const updatedJourneys = proj.journeys.map((journey, jIndex) => {
                if (jIndex === parseInt(journeyData.journeyindex)) {
                  const updatedSteps = journey.steps.map((step, sIndex) => {
                    if (sIndex === parseInt(journeyData.stepindex)) {
                      return { ...step, description: jValue, touchpoint: touchPoint };
                    }
                    return step;
                  });
                  return { ...journey, steps: updatedSteps };
                }
                return journey;
              });
              return { ...proj, journeys: updatedJourneys };
            }
            return proj;
          })
        };
        setUsers(users.map(user => user.key === userKey ? updatedUserData : user));

      }
        break;

      // Remove um passo de uma journey
      case 'remove-journey-step': {
        const updatedUserData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              const updatedJourneys = proj.journeys.map((journey, jIndex) => {
                if (jIndex === parseInt(journeyData.journeyindex)) {
                  const updatedSteps = journey.steps.filter((step, sIndex) => {
                    return sIndex !== parseInt(journeyData.stepindex);
                  });
                  return { ...journey, steps: updatedSteps };
                }
                return journey;
              });
              return { ...proj, journeys: updatedJourneys };
            }
            return proj;
          })
        };
        setUsers(users.map(user => user.key === userKey ? updatedUserData : user));

      }
        break;

      // Remove a journey por inteiro
      case 'remove-journey': {
        const updatedUserData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              const updatedJourneys = proj.journeys.filter((journey, jIndex) => {
                return jIndex !== parseInt(journeyData.journeyindex)
              });
              return { ...proj, journeys: updatedJourneys };
            }
            return proj;
          })
        };
        setUsers(users.map(user => user.key === userKey ? updatedUserData : user));



      }
        break;

      // Adiciona um passo na journey selecionada
      case 'add-step': {
        const newStep = { step: journeyData.stepindex, description: jValue };
        const updatedUserData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              const journeyIndex = parseInt(journeyData.journeyindex);
              const updatedJourneys = [...proj.journeys];
              updatedJourneys[journeyIndex].steps.push(newStep);

              return { ...proj, journeys: updatedJourneys };
            }
            return proj;
          })
        };
        setUsers(users.map(user => user.key === userKey ? updatedUserData : user));


      }
        break;

      default: console.log('Operação desconhecida')
    }
    setJourneyData({})
    // setTouchPoint(false)
    handleRemove('journey')

  }

  return (
    <div
      className={"modal show "}
      style={{ display: modal.journeys ? 'block' : 'none', position: 'absolute', background: '#00000080', height: bodyHeight }}
    >
      <Modal.Dialog style={{ marginTop: '6rem' }}>
        <Modal.Header closeButton onClick={() => {
          handleRemove('journey')
          setJourneyData({})
        }}>
          <Modal.Title> {getTitle()} </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {(operation !== 'remove-journey') &&
            <>
              <Form.Control
                value={jValue}
                type="text"
                onChange={(e) => setJValue(e.target.value)}
                onKeyUp={(e) => { if (e.key === 'Enter') updateJourney() }}
                placeholder={getPlaceholder()}
                style={{ cursor: 'text' }}
              />
              <div className="form-check form-switch">
                <input 
                className="form-check-input" 
                type="checkbox" 
                id="touchpoint" 
                checked={touchPoint}
                onChange={(e) => setTouchPoint(e.target.checked)}/>
                <label className="form-check-label" >Touchpoint</label>
              </div>
            </>
          }

        </Modal.Body>

        <Modal.Footer>
          {(removeType) &&
            <RemoveButton
              handleRemove={handleRemove}
              type={removeType}
              update={updateJourney}
            />}
          <Button variant="primary" onClick={() => updateJourney()}>Salvar</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

const AddUserStories = ({ userData, setUserData, userKey, users, setUsers, storyData, setStoryData, handleRemove, modal, projectKey }) => {
  const [sValue, setSValue] = useState('')
  const [sType, setSType] = useState('user')
  const [operation, setOperation] = useState('')
  const [user, setUser] = useState(null)

  //Atualiza o usuario atual
  useEffect(() => {
    setUser(users.find(user => user.key === userKey))
  }, [users, userKey, projectKey])
  // Adiciona efeitos caso as variáveis mudem
  useEffect(() => {
    // Define sValue para ser o título da story clicada
    let foundStory = null;
    const user = users.find(user => user.key === userKey);
    user.projects.forEach(proj => {
      if (proj.key === projectKey) {
        proj.stories.forEach(story => {
          if (story.id === storyData) {
            foundStory = story;
          }
        });
      }
    })
    setSValue(foundStory?.title)
  }, [storyData, modal.userStories])

  // Define o tipo de operação
  useEffect(() => {
    if (storyData !== '') setOperation('description')
    else setOperation('name')
  }, [storyData, operation, sValue]);

  // Deixa o campo sValue e o storyData vazios após o modal se fechar
  useEffect(() => {
    if (modal.userStories === false) { setSValue(''); setStoryData('') }
  }, [modal.userStories])

  // Renumerar os ids das userstories
  const renumberStories = (stories) => {
    // Separar stories por tipo
    const userStories = stories.filter(story => story.id.startsWith('US'));
    const systemStories = stories.filter(story => story.id.startsWith('SS'));

    // Ordenar e renumerar US
    const numberedUserStories = userStories
      .sort((a, b) => {
        const idA = parseInt(a.id.replace('US', ''));
        const idB = parseInt(b.id.replace('US', ''));
        return idA - idB;
      })
      .map((story, index) => ({
        ...story,
        id: `US${(index + 1).toString().padStart(2, '0')}`
      }));

    // Ordenar e renumerar SS  
    const numberedSystemStories = systemStories
      .sort((a, b) => {
        const idA = parseInt(a.id.replace('SS', ''));
        const idB = parseInt(b.id.replace('SS', ''));
        return idA - idB;
      })
      .map((story, index) => ({
        ...story,
        id: `SS${(index + 1).toString().padStart(2, '0')}`
      }));

    // Combinar os arrays mantendo a ordem
    return [...numberedUserStories, ...numberedSystemStories];
  };

  // Atualiza os valores do array userStory    
  const updateUserStory = (op) => {
    const operationType = (op ? op : operation)

    switch (operationType) {
      // Adiciona uma nova STORY
      case 'name': {
        const updatedUserData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              const newStory = {
                id: sType === 'user' ?
                  `US${(proj.stories.length + 1).toString().padStart(2, '0')}`
                  : `SS${(proj.stories.length + 1).toString().padStart(2, '0')}`,
                title: sValue,
                type: sType
              };

              const updatedStories = renumberStories([
                ...proj.stories,
                newStory
              ]);

              return {
                ...proj,
                stories: updatedStories
              };
            }
            return proj;
          })
        };
        setUsers(users.map(user => user.key === userKey ? updatedUserData : user));
      }
        break;

      // Altera a descrição da story
      case 'description': {
        const updatedUserData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              const updatedStories = proj.stories.map((story) => {
                if (story.id === storyData) {
                  return { ...story, title: sValue, type: sType }
                }
                return story
              })
              return { ...proj, stories: updatedStories }
            }
            return proj
          })
        };


        // Update user in users array
        const updatedUsers = users.map(user =>
          user.key === userKey ? { ...user, projects: updatedUserData.projects } : user
        );
        setUsers(updatedUsers);
      }
        break;

      // Remove a story
      case 'remove': {
        const updatedUserData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              const updatedStories = proj.stories.filter(story => {
                return story.id !== storyData
              })
              return { ...proj, stories: renumberStories(updatedStories) }
            }
            return proj
          })
        };


        // Update user in users array
        const updatedUsers = users.map(user =>
          user.key === userKey ? { ...user, projects: updatedUserData.projects } : user
        );
        setUsers(updatedUsers);
      }
        break;

      default: console.log('Operação desconhecida')
        break;
    }
    setStoryData('')
    setSValue('')
    handleRemove('userStory')
  }

  return (
    <div
      className={"modal show "}
      style={{ display: modal.userStories ? 'block' : 'none', position: 'absolute', background: '#00000080' }}
    >
      <Modal.Dialog style={{ marginTop: '6rem' }}>
        <Modal.Header closeButton onClick={() => handleRemove('userStory')}>
          <Modal.Title>Adicionar Estória</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>Título da estória</>
          <Form.Control
            type="text"
            value={sValue}
            onChange={(e) => setSValue(e.target.value)}
            onKeyUp={(e) => { if (e.key === 'Enter') updateUserStory() }}
            placeholder="Eu como..."
            style={{ cursor: 'text' }}
          />
          <>Tipo de estória</>
          <select
            value={sType}
            onChange={(e) => setSType(e.target.value)}
            className="form-select"
            aria-label="Default select example"
          >
            <option value="user">Usuário</option>
            <option value="system">Sistema</option>
          </select>
        </Modal.Body>

        <Modal.Footer>
          <RemoveButton
            handleRemove={handleRemove}
            type={'userStory'}
            update={updateUserStory}
          />
          <Button variant="primary" onClick={() => updateUserStory()}>Salvar</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

const AddGoalSketch = ({ userKey, users, setUsers, goalData, setGoalData, handleRemove, modal, projectKey }) => {

  const [goalField, setGoalField] = useState({
    title: '', type: 'BG', priority: 'LOW'
  })
  const [operation, setOperation] = useState('')
  const [user, setUser] = useState(null)

  //Atualiza o usuario atual
  useEffect(() => {
    setUser(users.find(user => user.key === userKey))
  }, [users, userKey, projectKey])

  // Adiciona efeitos caso as variáveis mudem
  useEffect(() => {
    // Define goalField.title para ser o título da goal clicada
    let foundGoal = null
    let user = users.find(user => user.key === userKey)
    user.projects.forEach(proj => {
      if (proj.key === projectKey) {
        proj.goalSketches.forEach(goal => {
          if (goal.id === goalData) {
            foundGoal = goal;
          }
        });
      }
    })
    setGoalField({ ...goalField, title: foundGoal?.title })
  }, [goalData, modal.goalSketches])

  // Define o tipo de operação
  useEffect(() => {
    if (goalData !== '') setOperation('description')
    else setOperation('name')
  }, [goalData, operation]);

  // Deixa o campo goalField.title e o goalData vazios após o modal se fechar
  useEffect(() => {
    if (modal.goalSketches === false) { setGoalField({ ...goalField, title: '' }); setGoalData('') }
  }, [modal.goalSketches])



  // Atualiza os valores do array goalSketch    
  const updateGoalSketch = (op) => {
    const operationType = (op ? op : operation)

    switch (operationType) {
      // Adiciona uma nova Goal
      case 'name': {
        const updateGoalData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              const newGoal = {
                type: goalField.type,
                title: goalField.title,
                priority: goalField.priority,
                id: nanoid()
              };

              const updatedGoals = [
                ...proj.goalSketches,
                newGoal
              ]

              return {
                ...proj,
                goalSketches: updatedGoals
              };
            }
            return proj;
          })
        };
        setUsers(users.map(user => user.key === userKey ? updateGoalData : user));
      }
        break;

      // Altera a descrição da goal
      case 'description': {
        const updateGoalData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              const updatedGoals = proj.goalSketches.map((goal) => {
                if (goal.id === goalData) {
                  return { ...goal, title: goalField.title, type: goalField.type, priority: goalField.priority }
                }
                return goal
              })
              return { ...proj, goalSketches: updatedGoals }
            }
            return proj
          })
        };
        setUsers(users.map(user => user.key === userKey ? updateGoalData : user));

      }
        break;

      // Remove a goal
      case 'remove': {
        const updateGoalData = {
          ...user,
          projects: user.projects.map(proj => {
            if (proj.key === projectKey) {
              const updatedGoals = proj.goalSketches.filter(goal => {
                return goal.id !== goalData
              })
              return { ...proj, goalSketches: updatedGoals }
            }
            return proj
          })
        };
        setUsers(users.map(user => user.key === userKey ? updateGoalData : user));
      }
        break;

      default: console.log('Operação desconhecida')
        break;
    }
    setGoalData('')
    setGoalField({ ...goalField, title: '' })
    handleRemove('goalSketch')
  }

  return (
    <div
      className={"modal show "}
      style={{ display: modal.goalSketches ? 'block' : 'none', position: 'absolute', background: '#00000080' }}
    >
      <Modal.Dialog style={{ marginTop: '6rem' }}>
        <Modal.Header closeButton onClick={() => handleRemove('goalSketch')}>
          <Modal.Title>
            {goalData === '' && <>Adicionar Goal Sketch</>}
            {goalData !== '' && <>Editar Goal</>}

          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <>Título da Goal</>
          <Form.Control
            type="text"
            value={goalField.title}
            onChange={(e) => setGoalField({ ...goalField, title: e.target.value })}
            onKeyUp={(e) => { if (e.key === 'Enter') updateGoalSketch() }}
            placeholder="Eu como..."
            style={{ cursor: 'text' }}
          />
          <>Tipo de goal</>
          <select
            value={goalField.type}
            onChange={(e) => setGoalField({ ...goalField, type: e.target.value })}
            className="form-select"
            aria-label="Default select example"
          >
            <option value="BG">Business Goal</option>
            <option value="CG">Constraint Goal</option>
          </select>
          <>Prioridade da Goal</>
          <select
            value={goalField.priority}
            onChange={(e) => setGoalField({ ...goalField, priority: e.target.value })}
            className="form-select"
            aria-label="Default select example"
          >
            <option value="LOW">Baixa</option>
            <option value="MED">Média</option>
            <option value="HIGH">Alta</option>
          </select>
        </Modal.Body>

        <Modal.Footer>
          <RemoveButton
            handleRemove={handleRemove}
            type={'goalSketch'}
            update={updateGoalSketch}
          />
          <Button variant="primary" onClick={() => updateGoalSketch()}>Salvar</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

const GenerateUserStories = ({ userKey, users, setUsers, modal, projectKey, handleRemove }) => {
  const [interviewText, setInterviewText] = useState(''); // Estado para armazenar a entrevista
  const [generatedStories, setGeneratedStories] = useState([]); // Armazena as stories geradas
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o spinner

  // Atualiza o usuário atual quando os dados mudam
  useEffect(() => {
    setUser(users.find(user => user.key === userKey));
  }, [users, userKey, projectKey]);

  // Função para enviar a entrevista e receber as stories do backend
  const generateStories = async () => {
    if (!interviewText.trim()) return alert("Digite a entrevista!");
    setIsLoading(true); // Ativa o spinner
    const baseUrl = 'http://localhost:5000'
    try {
      const response = await fetch(`${baseUrl}/generate-stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interview: interviewText }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedStories(data.stories); // Assume que o backend retorna um array de histórias
        console.log('Stories geradas:', data.stories);
      } else {
        alert('Erro ao gerar stories.');
      }
    } catch (error) {
      console.error('Erro ao conectar com a rota:', error);
      alert('Erro ao gerar stories.');
    } finally {
      setIsLoading(false); // Desativa o spinner
    }
  };

  // Adiciona as stories geradas ao usuário atual
  const saveGeneratedStories = () => {
    if (!user || !projectKey || generatedStories.length === 0) return;

    const updatedUserData = {
      ...user,
      projects: user.projects.map(proj => {
        if (proj.key === projectKey) {
          return {
            ...proj,
            stories: [...proj.stories, ...generatedStories],
          };
        }
        return proj;
      }),
    };

    setUsers(users.map(user => (user.key === userKey ? updatedUserData : user)));
    setGeneratedStories([]); // Limpa as stories geradas
    setInterviewText(''); // Limpa a entrevista
    handleRemove('generateUserStories'); // Fecha o modal
  };

  // Função para descartar as stories geradas
  const discardStories = () => {
    setGeneratedStories([]);
  };

  return (
    <div
      className={"modal show "}
      style={{ display: modal.generateUserStories ? 'block' : 'none', position: 'absolute', background: '#00000080' }}
    >
      <Modal.Dialog style={{ marginTop: '6rem' }}>
        <Modal.Header closeButton onClick={() => handleRemove('generateUserStories')}>
          <Modal.Title>Gerar Stories</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>Digite a entrevista:</>
          <Form.Control
            as="textarea"
            rows={4}
            value={interviewText}
            onChange={(e) => setInterviewText(e.target.value)}
            placeholder="Cole aqui a entrevista..."
          />
          <Button 
            variant="secondary" 
            onClick={generateStories} 
            className="mt-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Gerando...</span>
              </>
            ) : 'Gerar Stories com GPT'}
          </Button>

          {isLoading && (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Gerando stories, por favor aguarde...</p>
            </div>
          )}

          {generatedStories.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <h5>Stories Geradas:</h5>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={discardStories}
                >
                  Descartar Stories
                </Button>
              </div>
              <ul>
                {generatedStories.map((story, index) => (
                  <li key={index}><strong>{story.id}</strong>: {story.title}</li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={saveGeneratedStories} disabled={generatedStories.length === 0}>
            Salvar Stories
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

export { AddProjectModal, JourneyDescriptionModal, AddUserStories, AddGoalSketch, GenerateUserStories }