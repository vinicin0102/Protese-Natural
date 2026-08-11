document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Animações de Scroll (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos que devem ser animados
    const revealElements = document.querySelectorAll(`
        [data-delay], .problem-card, .result-card, .bonus-card, 
        .testimonial-card, .module-card, .solution-benefits li,
        .section-header, .solution-text, .solution-visual, 
        .guarantee-card, .pricing-card, .instagram-content, 
        .final-cta-content
    `);
    
    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Animação de Contadores (Números)
    const statsSection = document.querySelector('#hero'); // Seção onde os números estão
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    // Função de easing (desaceleração)
    const easeOutQuad = t => t * (2 - t);

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // ~2 segundos
            let startTime = null;

            const updateCounter = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = currentTime - startTime;
                const percentage = Math.min(progress / duration, 1);
                
                counter.innerText = Math.floor(easeOutQuad(percentage) * target);
                
                if (progress < duration) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            
            requestAnimationFrame(updateCounter);
        });
    };

    const counterObserver = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !countersAnimated) {
            animateCounters();
            countersAnimated = true;
            counterObserver.unobserve(entry.target);
        }
    }, { threshold: 0.1 });

    if (statsSection && counters.length > 0) {
        counterObserver.observe(statsSection);
    }

    // 3. Header Fixo (Sticky Header)
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 4. Accordion de FAQ
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(faq => {
        const question = faq.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = faq.classList.contains('active');
                
                // Fecha todos os outros
                faqs.forEach(f => f.classList.remove('active'));
                
                // Abre o clicado se estava fechado
                if (!isActive) {
                    faq.classList.add('active');
                }
            });
        }
    });

    // 5. Accordion de Módulos
    const modules = document.querySelectorAll('.module-card');
    if (modules.length > 0) {
        // Deixa o primeiro módulo aberto por padrão
        modules[0].classList.add('active');
    }
    modules.forEach(module => {
        const header = module.querySelector('.module-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = module.classList.contains('active');
                
                // Fecha todos os outros
                modules.forEach(m => m.classList.remove('active'));
                
                // Abre o clicado se estava fechado
                if (!isActive) {
                    module.classList.add('active');
                }
            });
        }
    });

    // 6. Scroll Suave para Âncoras (Smooth Scroll)
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Compensa a altura do header fixo (aprox 80px)
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Visibilidade do CTA Flutuante
    const floatingCta = document.getElementById('floatingCta');
    const heroSection = document.getElementById('hero');
    if (floatingCta && heroSection) {
        window.addEventListener('scroll', () => {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            // Mostra o CTA flutuante após passar do hero
            if (heroBottom < 0) {
                floatingCta.classList.add('visible');
            } else {
                floatingCta.classList.remove('visible');
            }
        }, { passive: true });
    }

    // 8. Partículas no Hero
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            // Propriedades aleatórias
            const size = Math.random() * 3 + 1; // 1px a 4px
            const posX = Math.random() * 100; // 0% a 100%
            const posY = Math.random() * 100;
            const duration = Math.random() * 10 + 10; // 10s a 20s
            const opacity = Math.random() * 0.2 + 0.1; // 0.1 a 0.3
            
            // Estilos da partícula
            particle.style.position = 'absolute';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = '#ffffff';
            particle.style.borderRadius = '50%';
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = opacity.toString();
            particle.style.pointerEvents = 'none';
            
            // Animação de flutuação usando Web Animations API
            particle.animate([
                { transform: 'translate(0, 0)' },
                { transform: `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50 - 50}px)` }
            ], {
                duration: duration * 1000,
                iterations: Infinity,
                direction: 'alternate',
                easing: 'ease-in-out'
            });

            particlesContainer.appendChild(particle);
        }
    }

    // 9. Timer de Urgência (Vagas)
    const urgencyTimer = document.getElementById('urgencyTimer');
    if (urgencyTimer) {
        let slots = 12;
        const updateTimer = () => {
            // Diminui as vagas lentamente apenas para simular escassez e urgência
            if (slots > 3 && Math.random() > 0.7) {
                slots--;
            }
            urgencyTimer.textContent = `⚠️ Últimas ${slots} vagas disponíveis nesta turma`;
        };
        
        updateTimer();
        setInterval(updateTimer, 15000); // Atualiza a cada 15 segundos
    }
    // 10. Funil Instagram DM
    const igChatBtnHero = document.getElementById('igChatBtnHero');
    const floatingIgBtn = document.getElementById('floatingIgBtn');
    const igModal = document.getElementById('igModal');
    const igCloseBtn = document.getElementById('igCloseBtn');
    const igChatBody = document.getElementById('igChatBody');
    const igChatOptions = document.getElementById('igChatOptions');
    
    let chatStarted = false;

    const openIgChat = (e) => {
        if(e) e.preventDefault();
        igModal.classList.add('active');
        if (!chatStarted) {
            startChatSequence();
        }
    };

    const closeIgChat = () => {
        igModal.classList.remove('active');
    };

    if (igChatBtnHero) igChatBtnHero.addEventListener('click', openIgChat);
    if (floatingIgBtn) floatingIgBtn.addEventListener('click', openIgChat);
    if (igCloseBtn) igCloseBtn.addEventListener('click', closeIgChat);
    if (igModal) igModal.addEventListener('click', (e) => {
        if(e.target === igModal) closeIgChat();
    });

    const triggerBtns = document.querySelectorAll('.ig-chat-trigger');
    triggerBtns.forEach(btn => btn.addEventListener('click', openIgChat));

    const addMessage = (text, type = 'received') => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ig-msg ${type}`;
        msgDiv.innerHTML = text;
        igChatBody.appendChild(msgDiv);
        igChatBody.scrollTop = igChatBody.scrollHeight;
    };

    const showTyping = () => {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ig-typing';
        typingDiv.id = 'igTypingIndicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        igChatBody.appendChild(typingDiv);
        igChatBody.scrollTop = igChatBody.scrollHeight;
    };

    const hideTyping = () => {
        const typingDiv = document.getElementById('igTypingIndicator');
        if (typingDiv) typingDiv.remove();
    };

    const showOptions = (options) => {
        igChatOptions.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'ig-option-btn';
            btn.textContent = opt.text;
            btn.onclick = () => {
                igChatOptions.innerHTML = ''; // Hide options
                addMessage(opt.text, 'sent');
                setTimeout(() => {
                    opt.action();
                }, 500);
            };
            igChatOptions.appendChild(btn);
        });
    };

    const startChatSequence = () => {
        chatStarted = true;
        showTyping();
        setTimeout(() => {
            hideTyping();
            addMessage('Fala meu querido(a)! Vi que você quer elevar o nível dos seus trabalhos com Prótese Capilar.');
            showTyping();
            setTimeout(() => {
                hideTyping();
                addMessage('Antes de te mostrar o método, me conta uma coisa: você já trabalha na área?');
                showOptions([
                    {
                        text: 'Estou começando do zero',
                        action: () => handleExperience('zero')
                    },
                    {
                        text: 'Já trabalho na área',
                        action: () => handleExperience('experiente')
                    }
                ]);
            }, 1500);
        }, 1500);
    };

    const handleExperience = (exp) => {
        showTyping();
        setTimeout(() => {
            hideTyping();
            if (exp === 'zero') {
                addMessage('Legal! Todo mundo começa de algum lugar. O método é passo a passo pra você não ficar perdido.');
            } else {
                addMessage('Show! Então você já sabe que só quem entrega resultado 100% natural consegue cobrar o que realmente vale.');
            }
            
            showTyping();
            setTimeout(() => {
                hideTyping();
                addMessage('Qual é a sua maior dificuldade hoje?');
                showOptions([
                    {
                        text: 'Acabamento artificial',
                        action: () => handleDificuldade()
                    },
                    {
                        text: 'Falta de clientes',
                        action: () => handleDificuldade()
                    },
                    {
                        text: 'Insegurança ao aplicar',
                        action: () => handleDificuldade()
                    }
                ]);
            }, 1500);
        }, 1500);
    };

    const handleDificuldade = () => {
        showTyping();
        setTimeout(() => {
            hideTyping();
            addMessage('Entendi perfeitamente. E é exatamente por isso que eu decidi abrir a caixa preta de tudo que eu faço no meu estúdio.');
            
            showTyping();
            setTimeout(() => {
                hideTyping();
                addMessage('Gravei um vídeo rápido te mostrando como o método resolve isso na prática. Assiste aí:');
                
                showTyping();
                setTimeout(() => {
                    hideTyping();
                    const vslHtml = `<div class="ig-vsl-container" style="margin-top:5px; border-radius: 12px; overflow: hidden; border: 1px solid #333;"><video id="igVslVideo" width="100%" controls style="display:block;"><source src="images/VSL JOTTA EDITADA 4.mov" type="video/mp4">Seu navegador não suporta este vídeo.</video></div>`;
                    addMessage(vslHtml);
                    
                    setTimeout(() => {
                        const vslVideo = document.getElementById('igVslVideo');
                        if (vslVideo) {
                            vslVideo.addEventListener('play', () => {
                                if (vslVideo.requestFullscreen) {
                                    vslVideo.requestFullscreen();
                                } else if (vslVideo.webkitRequestFullscreen) { // Safari
                                    vslVideo.webkitRequestFullscreen();
                                } else if (vslVideo.msRequestFullscreen) { // IE11
                                    vslVideo.msRequestFullscreen();
                                }
                            });
                        }
                    }, 500);
                    
                    showTyping();
                    setTimeout(() => {
                        hideTyping();
                        addMessage('De R$ 1.097, por apenas 10x de R$ 49,70... e você recupera isso logo na sua primeira aplicação.<br><br>Topa entrar na turma?');
                        showOptions([
                            {
                                text: 'Sim, quero me inscrever agora!',
                                action: () => {
                                    addMessage('Show! 🎉 Te vejo lá dentro da área de alunos.', 'received');
                                    setTimeout(() => {
                                        window.location.hash = '#oferta';
                                        closeIgChat();
                                    }, 2000);
                                }
                            }
                        ]);
                    }, 5000); // tempo pro usuario dar play no video
                }, 1500);
            }, 2000);
        }, 1500);
    };
});
