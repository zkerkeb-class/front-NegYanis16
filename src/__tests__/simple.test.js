// Test simple pour vérifier que l'environnement de test fonctionne
describe('Tests simples', () => {
  test('devrait fonctionner', () => {
    expect(1 + 1).toBe(2);
  });

  test('devrait avoir Jest configuré', () => {
    expect(jest).toBeDefined();
  });

  test('devrait avoir les matchers jest-dom', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    document.body.appendChild(div);
    
    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent('Hello World');
    
    document.body.removeChild(div);
  });

  test('devrait avoir localStorage mocké', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    
    // localStorage fonctionne pour les tests
    localStorage.clear();
    expect(localStorage.getItem('test')).toBeNull();
  });

  test('devrait avoir fetch mocké', () => {
    expect(fetch).toBeDefined();
    expect(typeof fetch).toBe('function');
  });
});
