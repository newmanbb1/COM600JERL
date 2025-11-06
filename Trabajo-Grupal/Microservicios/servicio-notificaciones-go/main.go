// main.go
package main

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

// Definimos una estructura para recibir los datos del JSON
type NotificacionData struct {
	EmailUsuario    string `json:"emailUsuario"`
	NombreEvento    string `json:"nombreEvento"`
	CantidadEntradas int    `json:"cantidadEntradas"`
}

// Función para manejar errores de forma simple
func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

// Función simulada para enviar el email
func sendEmailNotification(data NotificacionData) {
	log.Printf("📧 Enviando correo de confirmación a: %s", data.EmailUsuario)
	log.Printf("   Asunto: ¡Tu compra para '%s' ha sido confirmada!", data.NombreEvento)
	log.Printf("   Cuerpo: Hola, confirmamos tu compra de %d entrada(s). ¡Disfruta el evento!", data.CantidadEntradas)
}

func main() {
	// Obtener la URL de RabbitMQ de las variables de entorno
	rabbitmqHost := os.Getenv("RABBITMQ_HOST")
	if rabbitmqHost == "" {
		rabbitmqHost = "amqp://guest:guest@localhost:5672/"
	}

	var conn *amqp091.Connection
	var err error

	// Bucle para intentar reconectar si la conexión falla
	for {
		conn, err = amqp091.Dial(rabbitmqHost)
		if err == nil {
			break
		}
		log.Println("🚨 No se pudo conectar a RabbitMQ, reintentando en 10 segundos...")
		time.Sleep(10 * time.Second)
	}
	defer conn.Close()
	log.Println("✅ Conexión establecida con RabbitMQ")

	ch, err := conn.Channel()
	failOnError(err, "Fallo al abrir un canal")
	defer ch.Close()

	// Declaramos la cola para asegurarnos de que existe. 'durable: true'
	q, err := ch.QueueDeclare(
		"notificaciones_queue", // nombre
		true,                   // durable
		false,                  // delete when unused
		false,                  // exclusive
		false,                  // no-wait
		nil,                    // arguments
	)
	failOnError(err, "Fallo al declarar la cola")

	// Consumir mensajes de la cola
	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack (confirmación automática de mensaje)
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Fallo al registrar un consumidor")

	var forever chan struct{}

	go func() {
		for d := range msgs {
			log.Println("\n[CONSUMER] 📩 Mensaje recibido...")
			
			var notification NotificacionData
			// Decodificar el mensaje JSON a nuestra estructura
			err := json.Unmarshal(d.Body, &notification)
			if err != nil {
				log.Printf("🚨 Error al decodificar JSON: %s", err)
				continue
			}

			// Procesar la notificación
			sendEmailNotification(notification)
			log.Println("[CONSUMER] ✅ Mensaje procesado.")
		}
	}()

	log.Printf(" [*] Esperando mensajes en la cola '%s'. Para salir presiona CTRL+C", q.Name)
	<-forever // Bucle infinito para mantener el programa corriendo
}