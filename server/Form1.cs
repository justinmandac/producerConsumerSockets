using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Collections;
using System.Threading;
using System.Net;
using System.Net.Sockets;

using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

namespace server
{
    public partial class Form1 : Form
    {

        private TcpListener tcpListener;
        private Thread listenThread;
        Queue<string> buffer = new Queue<string>();
        int bufferSize = 0;
        
        public Form1()
        {
            InitializeComponent();
        }

        private void start_server()
        {
            this.tcpListener = new TcpListener(IPAddress.Any, 3000);
            this.listenThread = new Thread(new ThreadStart(ListenForClients));
            this.listenThread.Start();
        }

        private void ListenForClients() 
        {
           // richTextBox1.AppendText("Server Started.");
            this.tcpListener.Start();

            while (true) 
            {
                TcpClient tcpClient = this.tcpListener.AcceptTcpClient();
                richTextBox1.AppendText("\n Connected");
                Thread clientThread = new Thread(new ParameterizedThreadStart(HandleClientRequest));
                clientThread.Start(tcpClient);
            }
        }

        private void HandleClientRequest(object tcpClient)
        {
            TcpClient client = (TcpClient)tcpClient;
            NetworkStream netStream = client.GetStream();

            byte[] message = new byte[4096];
            int bytesRead;
            string data;

            while (true) 
            {
                bytesRead = 0;

                try
                {
                    bytesRead = netStream.Read(message, 0, 4096);
                    data = System.Text.Encoding.ASCII.GetString(message);
                    string[] str = data.Split('-');

                    if (str[0] == "0")
                    {
                        buffer.Enqueue(str[2]);
                        this.reply(netStream, "0-server-" + str[2]);
                       // richTextBox1.AppendText("\n Added " + str[2] + " data from " + str[1]);
                    }
                    else 
                    {
                        string msg = "1-server-"+buffer.Dequeue();
                        this.reply(netStream, msg);
                        //richTextBox1.AppendText("\n Message " + msg + "send to" + str[1]);
                    }

                    //if()
                   
                }

                catch 
                {
                    break; 
                }

                if (bytesRead == 0)
                    break;

            }
            client.Close();
        }

        private void reply(NetworkStream clientStream,string msg) 
        {
            ASCIIEncoding encoder = new ASCIIEncoding();
            byte[] buffer = encoder.GetBytes(msg);

            clientStream.Write(buffer, 0, buffer.Length);
            clientStream.Flush();
        }



        private void button1_Click(object sender, EventArgs e)
        {
            this.start_server();
            button1.Enabled = false;
        }
      
       
    }
}
