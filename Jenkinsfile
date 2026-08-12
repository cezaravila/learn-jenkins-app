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

        stage('Docker') {
            steps {
                sh 'docker build -t my-playwright .'
            }
        }
        
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
                    args '-e CLOUDFLARE_ACCOUNT_ID=${CLOUDFLARE_ACCOUNT_ID} -e CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN}'
                }
            }

            /*environment {
                // Altere para a URL e o nome que você definiu no Cloudflare Pages
                CI_ENVIRONMENT_URL     = 'https://learn-jenkins-app.pages.dev'
                CLOUDFLARE_ACCOUNT_ID = credentials('cloudflare-account-id')
                CLOUDFLARE_API_TOKEN  = credentials('cloudflare-api-token')
            }
            steps {
                sh '''
                    echo "Publicando no Cloudflare Pages (Staging)..."
                    npx wrangler pages deploy build --project-name=learn-jenkins-app
                    
                    export CI_ENVIRONMENT_URL="https://learn-jenkins-app.pages.dev"
                    npx playwright test --reporter=html
                '''
            }*/

            steps {
                withCredentials([
                    string(credentialsId: 'cloudflare-account-id', variable: 'ACCOUNT_ID'),
                    string(credentialsId: 'cloudflare-api-token', variable: 'API_TOKEN')
                ]) {
                    sh '''
                        echo "Publicando no Cloudflare Pages..."
                        npx wrangler pages deploy build --project-name=learn-jenkins-app

                        export CI_ENVIRONMENT_URL="https://learn-jenkins-app.pages.dev"

                        echo "Aguardando propagação do deploy (10s)..."
                        sleep 10

                        npx playwright test --reporter=line
                    '''
                }
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
                        reportName: 'Staging_E2E',
                        useWrapperFileDirectly: true
                        ])
                }
            }
        }

        stage('Deploy prod') {
            agent {
                docker {
                    image 'my-playwright'
                    reuseNode true
                    // Passa os tokens para dentro do container
                    args '-e CLOUDFLARE_ACCOUNT_ID=${CLOUDFLARE_ACCOUNT_ID} -e CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN}'
                }
            }

            environment {
                // Altere para a URL e o nome que você definiu no Cloudflare Pages
                CI_ENVIRONMENT_URL     = 'https://learn-jenkins-app.pages.dev'
                CLOUDFLARE_ACCOUNT_ID = credentials('cloudflare-account-id')
                CLOUDFLARE_API_TOKEN  = credentials('cloudflare-api-token')
            }

            steps {
                sh '''
                    node --version
                    npx wrangler --version
                    
                    echo "Publicando no Cloudflare Pages..."
                    npx wrangler pages deploy build --project-name=learn-jenkins-app
                    
                    npx playwright test --reporter=html
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
                        reportName: 'Prod_E2E',
                        useWrapperFileDirectly: true
                        ])
                }
            }
            
        }

    }

    
}