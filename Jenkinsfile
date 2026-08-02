pipeline {
    agent any

    environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        NETLIFY_SITE_ID = '2e035a6f-d3aa-493a-94c1-eebe5426a793'
    }

    /*
    TZ=America/Campo_Grande
    34 17 * * 6
    */

    stages {
        
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }
        

        stage('Tests') {
            parallel {
                stage('Unit tests') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            reuseNode true
                        }
                    }

                    steps {
                        sh '''
                            #test -f build/index.html
                            npm test
                        '''
                    }
                    post {
                        always {
                            junit 'jest-results/junit.xml'
                        }
                    }
                }

                stage('E2E') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                            reuseNode true
                        }
                    }

                    steps {
                        sh '''
                            npm install serve
                            node_modules/.bin/serve -s build &
                            sleep 10
                            npx playwright test  --reporter=html
                        '''
                    }

                    post {
                        always {
                            // 1. Libera permissão de leitura para o usuário do Jenkins
                            sh 'chmod -R 755 playwright-report'

                            // 2. Publica o relatório HTML
                            publishHTML([
                                allowMissing: false, 
                                alwaysLinkToLastBuild: true, 
                                keepAll: true, 
                                reportDir: 'playwright-report', 
                                reportFiles: 'index.html', 
                                reportName: 'Playwright_Local', 
                                reportTitles: '', 
                                useWrapperFileDirectly: true
                                ])
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                    // Passa a variável de ambiente diretamente para DENTRO do container Docker
                    args '-e NETLIFY_AUTH_TOKEN=${NETLIFY_AUTH_TOKEN} -e NETLIFY_SITE_ID=${NETLIFY_SITE_ID}'
                }
            }
            
            steps {
                sh '''
                    npm install netlify-cli@20.1.1
                    node_modules/.bin/netlify --version
                    echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
                    node_modules/.bin/netlify status
                    node_modules/.bin/netlify deploy --dir=build --prod
                '''
            }
        }

        stage('Prod E2E') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                    reuseNode true
                }
            }

            environment {
                CI_ENVIRONMENT_URL = 'https://cerulean-sherbet-9d7a65.netlify.app'
            }

            steps {
                sh '''
                    npx playwright test  --reporter=html
                '''
            }

            post {
                always {
                    // 1. Libera permissão de leitura para o usuário do Jenkins
                    sh 'chmod -R 755 playwright-report'

                    // 2. Publica o relatório HTML
                    publishHTML([
                        allowMissing: false, 
                        alwaysLinkToLastBuild: true, 
                        keepAll: true, 
                        reportDir: 'playwright-report', 
                        reportFiles: 'index.html', 
                        reportName: 'Playwright_E2E',
                        useWrapperFileDirectly: true
                        ])
                }
            }

            
        }

    }

    
}