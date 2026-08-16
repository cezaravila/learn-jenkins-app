pipeline {
    agent any

    environment {
        REACT_APP_VERSION = "1.0.$BUILD_ID"
    }

    /*
    TZ=America/Campo_Grande
    34 17 * * 6

    System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "")
    System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' 'unsafe-inline' data:;")
    */

    stages {

     
        
        stage('Build') {
            agent {
                docker {
                    image 'node:22-alpine'
                    // Quando o reuseNode true está presente em um estágio individual, o Jenkins reaproveita 
                    // o ambiente do container ou do nó do estágio anterior para evitar reinstalar tudo do zero
                    reuseNode true
                }
            }
            
            steps {
                sh '''
                    npx wrangler --version
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
                            image 'node:22-alpine'
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
                            image 'my-playwright'
                            reuseNode true
                        }
                    }

                    steps {
                        /*sh '''
                            npx serve -s build &
                            sleep 10
                            npx playwright test  --reporter=html
                        '''*/
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
                                reportName: 'Playwright_Local', 
                                reportTitles: '', 
                                useWrapperFileDirectly: true
                                ])
                        }
                    }
                }
            }
        }
        
        stage('Deploy staging') {
            agent {
                docker {
                    image 'my-playwright'
                    reuseNode true
                }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'cloudflare-account-id', variable: 'ACCOUNT_ID'),
                    string(credentialsId: 'cloudflare-api-token', variable: 'API_TOKEN')
                ]) {
                    sh '''
                        echo "Exportando credenciais de staging..."
                        export CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID"
                        export CLOUDFLARE_API_TOKEN="$API_TOKEN"

                        echo "Gerando a build..."
                        npm run build

                        echo "Publicando em Staging..."
                        npx --yes wrangler@3.109.2 pages deploy build --project-name=learn-jenkins-app

                        export PLAYWRIGHT_TEST_BASE_URL="https://learn-jenkins-app.pages.dev"
                        sleep 5

                        echo "Executando testes no Staging..."
                        npx playwright test --reporter=list
                    '''
                }
            }
        }

        stage('Deploy prod') {
            agent {
                docker {
                    image 'my-playwright'
                    reuseNode true
                }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'cloudflare-account-id', variable: 'ACCOUNT_ID'),
                    string(credentialsId: 'cloudflare-api-token', variable: 'API_TOKEN')
                ]) {
                    sh '''
                        echo "Exportando credenciais de produção..."
                        export CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID"
                        export CLOUDFLARE_API_TOKEN="$API_TOKEN"

                        echo "Gerando a build..."
                        npm run build

                        echo "Publicando na Cloudflare em PRODUÇÃO..."
                        npx --yes wrangler@3.109.2 pages deploy build --project-name=learn-jenkins-app
                    '''
                }
            }
        }   
    }
    post {
        always {
            archiveArtifacts artifacts: '*.png', allowEmptyArchive: true
        }
    }
}